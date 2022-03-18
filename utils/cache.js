import NodeCache from 'node-cache';
import Logger from '../utils/logger.js';

const logger = new Logger('cache')

const cache = new NodeCache({ stdTTL: 15 });

const nodecache = (req, res, next) =>{
  try {

    const { id } = req.params;
    if (cache.has(id)) {
      logger.info(`Cache hit - ${id}`);
      return res.status(200).json(cache.get(id));
    }

    if (cache.has(req.cookies['cloudinary-cache'])) {
      logger.info(`Cache hit - ${25}`);
      return res.status(200).json(cache.get(25));
    }
      logger.info(`Cache missed - ${id}`);
      next();

  } catch (err) {
    logger.error(`Cache error - ${err}`);
    throw new Error(err)
  }
}

export {nodecache, cache};

