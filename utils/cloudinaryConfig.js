import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Logger from './logger.js';

dotenv.config();

const logger = new Logger('cloudinary');

/*
  One place where Cloudinary credentials are read.

  Two naming schemes are in play and both have to keep working:

    CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
      what the Fly app has set as secrets, and the SDK's own convention.

    CLOUND_NAME / CLOUD_API_KEY / CLOUD_API_SECRET
      the legacy names (note the typo in CLOUND_NAME) still used by the local
      .env, `.env example`, and the controller tests.

  Production had only the first set while every controller read only the
  second, so api_key was undefined and the SDK threw "Must supply api_key"
  before it ever made a request — surfacing as a 500 on POST /api/upload.
  Preferring the standard names with a fallback fixes prod without breaking
  any local setup.

  cloudinary.config() and cloudinary.v2.config are the same function, so
  configuring once here applies to v1 and v2 call sites alike.
*/
function readCredentials() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUND_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET,
  };
}

cloudinary.config(readCredentials());

// Read env each call rather than caching the boot-time answer: the controller
// tests set these variables after importing the module, and a stale snapshot
// would report "configured" for credentials that are no longer there.
export function isCloudinaryConfigured() {
  const { cloud_name, api_key, api_secret } = readCredentials();
  return Boolean(cloud_name && api_key && api_secret);
}

// Fail loudly at boot instead of at the first upload. A missing credential is
// a deploy problem, and the request-time error ("Must supply api_key") names
// no variable and reaches the user as an opaque 500.
if (!isCloudinaryConfigured()) {
  const { cloud_name, api_key, api_secret } = readCredentials();
  const missing = [
    !cloud_name && 'CLOUDINARY_CLOUD_NAME',
    !api_key && 'CLOUDINARY_API_KEY',
    !api_secret && 'CLOUDINARY_API_SECRET',
  ].filter(Boolean);
  const warning = `Cloudinary is not configured — missing ${missing.join(', ')}. Uploads and media endpoints will fail.`;
  // console.error as well as the file logger: utils/logger.js only writes to
  // ./logs/allLogs.log, which is not what `fly logs` shows.
  console.error('[cloudinary]', warning);
  logger.error(warning);
}

export default cloudinary;
