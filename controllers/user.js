import Users from '../models/user.js';
import Payments from '../models/payment.js';
import Logger from '../utils/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const logger = new Logger('articles');

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

async function register(req, res) {
    try {
        let { name, email, password, role } = req.body;
        // Admin is role 1

        const user = await Users.findOne({ email })
        if (user) return res.status(400).json({ msg: "The email already exists" })

        if (password.length < 6)
            return res.status(400).json({ msg: "Password is at least 6 characters long" })

        //Password Encryption
        const passwordHash = await bcrypt.hash(password, 10)

        //Create new user instance
        const newUser = new Users({
            name, email, password: passwordHash, role
        })
        // Save mongodb
        await newUser.save()

        //Create jsonwebtoken for authentication
        const accesstoken = createAccessToken({ id: newUser._id })
        const refreshtoken = createRefreshToken({ id: newUser._id })

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/api/user/refresh_token',
            maxAge: 7 * 25 * 60 * 60 * 1000
        })

        res.json({ accesstoken })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

function refreshToken(req, res) {
    try {
      const rf_token = req.cookies.refreshtoken.replace(/^JWT\s/, "");
        if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ msg: "Please Login or Register" })

            const accesstoken = createAccessToken({ id: user.id })

            res.json({ accesstoken })
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message, "err": err })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email })
        if (!user) return res.status(400).json({ msg: "User does not exist." })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Invalid password" })

        const accesstoken = createAccessToken({ id: user._id })
        const refreshtoken = createRefreshToken({ id: user._id })

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/api/user/refresh_token',
            maxAge: 7 * 25 * 60 * 60 * 1000
        })
        res.json({accesstoken })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function logout(req, res) {
  try {
    res.clearCookie('refreshtoken', { path: '/api/user/refresh_token'});
    return res.json({msg: "Logged Out"})
  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
}

async function getAllUsers(req, res) {
  try {
      const users = await Users.find()

      logger.info("Returning all of the users");

      res.json({
          status: 'success',
          users: users,
          result: users.length,
      })
  } catch (err) {

      logger.error(err);

      return res.status(500).json({ msg: err.message })
  }
}

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
		return res.json({ msg: "Added to cart" });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function history(req, res) {
	try {
		const history = await Payments.find({ user_id: req.user.id });

		return res.json(history);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function getUser(req, res) {
	try {
		const user = await Users.findById(req.user.id).select("-password");
		if (!user) return res.status(400).json({ msg: "User does not exist" });
		res.json(user);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function updateProfile(req, res) {
  try {
      const { name, avatar, title, work, education, skills, location, phone, socialMedia, websites } = req.body;

      await Users.findOneAndUpdate({ _id: req.params.id }, {
        name, avatar, title, work, education, skills, location, phone, socialMedia, websites
      })

      res.json({ msg: 'Updated profile' })
  } catch (err) {

      logger.error(err);

      return res.status(500).json({ msg: err.message });
  }
}

async function deleteProfile(req, res) {
  try {

      logger.info(`Deleted user ${req.params.id} has been deleted`);

      await Users.findByIdAndDelete(req.params.id)

      res.json({ msg: "Deleted user" })
  } catch (err) {

      logger.error(err)

      return res.status(500).json({ msg: err.message })
  }
}

export {
  register,
  refreshToken,
  login,
  logout,
  getUser,
  updateProfile,
  deleteProfile,
  getAllUsers,
  addCart,
  history
 };
