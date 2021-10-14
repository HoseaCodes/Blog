import NodeCache from 'node-cache';
import Logger from '../utils/logger.js';

const logger = new Logger('cache')

const cache = new NodeCache({ stdTTL: 15 });

const nodecache = duration => (req, res, next) =>{
  try {
    if (req.method !== 'GET') {
      logger.error('Cannot cache non-GET method');
      return next();
    }
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.info(`Cache hit for ${key}`);
      res.send(cachedResponse);
    } else {
      logger.debug(`Cache miss for ${key}`);
      res.send = body => {
        // res.originalSend(body);
        cache.set(key, body, duration);
      };
      next();
    }
  } catch (err) {
    throw new Error(err)
  }
}

export default nodecache;
