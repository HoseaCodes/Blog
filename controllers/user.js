import Users from "../models/user.js";
import Payments from "../models/payment.js";
import Logger from "../utils/logger.js";
import { cache } from "../utils/cache.js";
const logger = new Logger("articles");

async function addCart(req, res) {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    console.log(req.body.cart);

    await Users.findByIdAndUpdate(
      { _id: req.user.id },
      {
        cart: req.body.cart,
      }
    );

    res.clearCookie("history-cache");

    return res.json({ msg: "Added to cart" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function history(req, res) {
  try {
    const history = await Payments.find({ user_id: req.user.id });

    res.cookie("history-cache", history.length + "history", {
      maxAge: 1000 * 60 * 60, // would expire after an hour
      httpOnly: true, // The cookie only accessible by the web server
    });

    cache.set(history.length + "history", {
      status: "success",
      result: history,
      location: "cache",
    });
    return res.json({
      status: "success",
      result: history,
      location: "main",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const originalBody = req.body;
    const {
      notifications,
      favoriteArticles,
      savedArticles,
      likedArticles,
      ...rest
    } = originalBody;

    const originalUser = await Users.findOne({ _id: req.params.id });

    if (notifications) {
      const existingNotificationsArticle = originalUser.notifications.filter(
        (notification) => notification !== req.params.id
      );
      if (existingNotificationsArticle.length == 1) {
        const removeNotificationsArticles = originalUser.notifications.filter(
          (notification) => notification == req.params.id
        );
        console.log(
          "removeNotificationsArticles",
          req.params.id,
          removeNotificationsArticles
        );
        await Users.findOneAndUpdate(
          { _id: req.params.id },
          {
            notifications: removeNotificationsArticles,
          }
        );
      } else {
        const newNotifications =
          originalUser.notifications.concat(notifications);
        const uniqueNotifications = [...new Set(newNotifications)];
        console.log({notifications})
        console.log("uniqueNotifications", req.params.id, uniqueNotifications);
        await Users.findOneAndUpdate(
          { _id: req.params.id },
          {
            notifications: uniqueNotifications,
          }
        );
      }
    }

    if (favoriteArticles) {
      const newFavoriteArticles =
        originalUser.favoriteArticles.concat(favoriteArticles);
      const uniqueFavoriteArticles = [...new Set(newFavoriteArticles)];
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          favoriteArticles: uniqueFavoriteArticles,
        }
      );
    }

    if (savedArticles) {
      const existingSavedArticle = originalUser.savedArticles.filter(
        (article) => article !== req.params.id
      );
      if (existingSavedArticle.length == 1) {
        const removeSavedArticles = originalUser.savedArticles.filter(
          (article) => article == req.params.id
        );
        console.log("removeSavedArticles", req.params.id, removeSavedArticles);
        await Users.findOneAndUpdate(
          { _id: req.params.id },
          {
            savedArticles: removeSavedArticles,
          }
        );
      } else {
        const newSavedArticles =
          originalUser.savedArticles.concat(savedArticles);
        const uniqueSavedArticles = [...new Set(newSavedArticles)];
        console.log("uniqueSavedArticles", req.params.id, uniqueSavedArticles);
        await Users.findOneAndUpdate(
          { _id: req.params.id },
          {
            savedArticles: uniqueSavedArticles,
          }
        );
      }
    }

    if (likedArticles) {
      const newLikedArticles = originalUser.likedArticles.concat(likedArticles);
      const uniqueLikedArticles = [...new Set(newLikedArticles)];
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          likedArticles: uniqueLikedArticles,
        }
      );
    }

    await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...rest,
      }
    );

    res.clearCookie("users-cache");
    res.clearCookie("user-cache");

    res.json({ msg: "Updated profile" });
  } catch (err) {
    logger.error(err);
    console.log(err.message);
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteProfile(req, res) {
  try {
    logger.info(`Deleted user ${req.params.id} has been deleted`);

    await Users.findByIdAndDelete(req.params.id);

    res.clearCookie("users-cache");
    res.clearCookie("user-cache");

    res.json({ msg: "Deleted user" });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

export {
  updateProfile,
  deleteProfile,
  addCart,
  history
};
