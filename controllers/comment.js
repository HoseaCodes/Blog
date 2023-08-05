import Comments from '../models/comment.js';
import Logger from '../utils/logger.js';
import {cache} from '../utils/cache.js';

const logger = new Logger('comments')

async function getComment(req, res) {
    try {
        const comments = await Comments.find()

        logger.info("Returning the list of comments");

        res.cookie('comments-cache', comments.length + "comments", {
          maxAge: 1000 * 60 * 60, // would expire after an hour
          httpOnly: true, // The cookie only accessible by the web server
        })

        cache.set( comments.length + "comments", {
          status: 'success',
          comments: comments,
          result: comments.length,
          location: 'cache',
        });

        res.json({
            status: 'success',
            comments: comments,
            result: comments.length,
            location: 'main',
        })

    } catch (err) {

        logger.error(err);

        return res.status(500).json({ msg: err.message })
    }
}

async function createComment(req, res) {
  try {

    const { comment_id, name, email, comment, markdown, user_id, avatar } = req.body;
    console.log(req.body)
    const com = await Comments.findOne({ comment_id });

    if (com) {
      logger.error("Comment already exist.");
      return res.status(400).json({ msg: "This comment already exists." })
    }

    const newComment = new Comments({
      comment_id, name, email, 
      comment, markdown, user_id, 
      blog: req.params.id, avatar
    })

    await newComment.save()

    logger.info(`New comment has been created`);
    res.clearCookie('comments-cache');

    res.json({ msg: "Created a new comment" });
  } catch (err) {

    logger.error(err)

    return res.status(500).json({ msg: err.message })
  }
}

async function deleteComment(req, res) {
    try {
        const post_id = req.params.id

        logger.info(`Deleted comment ${post_id} has been deleted`);

        await Comments.findByIdAndDelete(post_id)
        res.clearCookie('comments-cache');
        res.json({ msg: "Deleted a article" })
    } catch (err) {

    logger.error(err)

    return res.status(500).json({ msg: err.message })
    }
}

export {
  createComment,
  getComment,
  deleteComment
};
