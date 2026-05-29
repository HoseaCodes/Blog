import Comments from '../models/comment.js';
import Logger from '../utils/logger.js';
import {cache} from '../utils/cache.js';

const logger = new Logger('comments')

const ADMIN_ROLE = 1;

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
    let { comment_id, postId, name, email, comment, user_id, avatar } = req.body;
    if (!name) name = 'Anonymous'
    if (!email) email = 'test@email.com'
    let date = (new Date()).toLocaleDateString

    console.log(req.body)
 
    // const com = await Comments.findOne({ comment_id });

    // if (com) {
    //   logger.error("Comment already exist.");
    //   return res.status(400).json({ msg: "This comment already exists." })
    // }

    const newComment = new Comments({
      name, email, comment, postId,
      blog: postId, date
    })

    await newComment.save()

    logger.info(`New comment has been created`);
    res.clearCookie('comments-cache');

    res.json({ msg: "Created a new comment" });
  } catch (err) {
    console.log(err)
    logger.error(err)

    return res.status(500).json({ msg: err.message })
  }
}

async function deleteComment(req, res) {
    try {
        if (req.user?.role !== ADMIN_ROLE) {
            return res.status(403).json({ msg: 'Only admins can delete comments.' });
        }

        const commentId = req.params.id;
        const deleted = await Comments.findByIdAndDelete(commentId);
        if (!deleted) return res.status(404).json({ msg: 'Comment not found.' });

        logger.info(`Comment ${commentId} deleted by admin ${req.user.id}`);
        res.clearCookie('comments-cache');
        res.json({ msg: 'Comment deleted' });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ msg: err.message });
    }
}

export {
  createComment,
  getComment,
  deleteComment
};
