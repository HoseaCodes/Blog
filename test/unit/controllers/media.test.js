import cloudinary from 'cloudinary';
import { 
  getMediaLibrary, 
  deleteMedia, 
  updateMediaMetadata, 
  searchMedia, 
  createFolder, 
  getMediaStats 
} from '../../../controllers/media.js';
import Logger from '../../../utils/logger.js';

jest.mock('cloudinary');
jest.mock('../../../utils/logger.js');

describe('Media Controller', () => {
  let req, res;
  let loggerMock;

  beforeEach(() => {
    req = {
      query: {},
      body: {}
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    loggerMock = {
      info: jest.fn(),
      error: jest.fn()
    };

    Logger.mockImplementation(() => loggerMock);

    jest.clearAllMocks();
  });

  describe('getMediaLibrary', () => {
    it('should return error if Cloudinary is not configured', async () => {
      process.env.CLOUND_NAME = '';
      process.env.CLOUD_API_KEY = '';

      await getMediaLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Media service not configured',
        media: [],
        folders: [],
        total: 0
      });
    });

    it('should retrieve media library successfully without folder', async () => {
      process.env.CLOUND_NAME = 'test-cloud';
      process.env.CLOUD_API_KEY = 'test-key';
      req.query = {};

      const mockResult = {
        resources: [
          { public_id: 'image1', url: 'http://example.com/image1' },
          { public_id: 'image2', url: 'http://example.com/image2' }
        ],
        total_count: 2,
        folders: []
      };

      const mockSearchChain = {
        sort_by: jest.fn().mockReturnThis(),
        max_results: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult)
      };

      cloudinary.v2 = {
        search: {
          expression: jest.fn().mockReturnValue(mockSearchChain)
        }
      };

      await getMediaLibrary(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        media: mockResult.resources,
        folders: [],
        total: 2
      });
    });

    it('should retrieve media library with specific folder', async () => {
      process.env.CLOUND_NAME = 'test-cloud';
      process.env.CLOUD_API_KEY = 'test-key';
      req.query = { folder: 'blog-articles' };

      const mockResult = {
        resources: [{ public_id: 'image1', url: 'http://example.com/image1' }],
        total_count: 1,
        folders: ['subfolder']
      };

      const mockSearchChain = {
        sort_by: jest.fn().mockReturnThis(),
        max_results: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult)
      };

      cloudinary.v2 = {
        search: {
          expression: jest.fn().mockReturnValue(mockSearchChain)
        }
      };

      await getMediaLibrary(req, res);

      expect(cloudinary.v2.search.expression).toHaveBeenCalledWith(
        'folder:HoseaCodes/blog-articles/*'
      );
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        media: mockResult.resources,
        folders: ['subfolder'],
        total: 1
      });
    });

    it('should handle errors during media library retrieval', async () => {
      process.env.CLOUND_NAME = 'test-cloud';
      process.env.CLOUD_API_KEY = 'test-key';

      const error = new Error('Search failed');
      cloudinary.v2 = {
        search: {
          expression: jest.fn().mockReturnValue({
            sort_by: jest.fn().mockReturnThis(),
            max_results: jest.fn().mockReturnThis(),
            execute: jest.fn().mockRejectedValue(error)
          })
        }
      };

      await getMediaLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: error.message });
    });
  });

  describe('deleteMedia', () => {
    it('should delete media successfully', async () => {
      req.body = { public_id: 'test-image' };

      cloudinary.v2 = {
        uploader: {
          destroy: jest.fn().mockResolvedValue({ result: 'ok' })
        }
      };

      await deleteMedia(req, res);

      expect(cloudinary.v2.uploader.destroy).toHaveBeenCalledWith('test-image');
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        msg: 'Media deleted successfully'
      });
    });

    it('should handle deletion errors', async () => {
      req.body = { public_id: 'test-image' };

      const error = new Error('Deletion failed');
      cloudinary.v2 = {
        uploader: {
          destroy: jest.fn().mockRejectedValue(error)
        }
      };

      await deleteMedia(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: error.message });
    });
  });

  describe('updateMediaMetadata', () => {
    it('should update media metadata successfully', async () => {
      req.body = {
        public_id: 'test-image',
        context: { alt_text: 'Test image description' }
      };

      const mockResult = { public_id: 'test-image', context: { alt_text: 'Test image description' } };

      cloudinary.v2 = {
        uploader: {
          explicit: jest.fn().mockResolvedValue(mockResult)
        }
      };

      await updateMediaMetadata(req, res);

      expect(cloudinary.v2.uploader.explicit).toHaveBeenCalledWith('test-image', {
        type: 'upload',
        context: { alt_text: 'Test image description' }
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        result: mockResult
      });
    });

    it('should handle metadata update errors', async () => {
      req.body = { public_id: 'test-image', context: {} };

      const error = new Error('Update failed');
      cloudinary.v2 = {
        uploader: {
          explicit: jest.fn().mockRejectedValue(error)
        }
      };

      await updateMediaMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: error.message });
    });
  });

  describe('searchMedia', () => {
    it('should search media successfully', async () => {
      req.query = { query: 'resource_type:image' };

      const mockResult = {
        resources: [
          { public_id: 'image1' },
          { public_id: 'image2' }
        ]
      };

      const mockSearchChain = {
        max_results: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult)
      };

      cloudinary.v2 = {
        search: {
          expression: jest.fn().mockReturnValue(mockSearchChain)
        }
      };

      await searchMedia(req, res);

      expect(cloudinary.v2.search.expression).toHaveBeenCalledWith('resource_type:image');
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: mockResult.resources
      });
    });

    it('should handle search errors', async () => {
      req.query = { query: 'resource_type:image' };

      const error = new Error('Search failed');
      cloudinary.v2 = {
        search: {
          expression: jest.fn().mockReturnValue({
            max_results: jest.fn().mockReturnThis(),
            execute: jest.fn().mockRejectedValue(error)
          })
        }
      };

      await searchMedia(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: error.message });
    });
  });

  describe('createFolder', () => {
    it('should return folder creation info', async () => {
      req.body = { name: 'blog-articles' };

      await createFolder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        msg: 'Folder blog-articles will be created on first upload',
        folder: 'HoseaCodes/blog-articles'
      });
    });
  });

  describe('getMediaStats', () => {
    it('should retrieve media stats successfully', async () => {
      const mockStats = {
        media_count: 150,
        bytes_used: 5000000,
        limit: 10000000
      };

      cloudinary.v2 = {
        api: {
          usage: jest.fn().mockResolvedValue(mockStats)
        }
      };

      await getMediaStats(req, res);

      expect(cloudinary.v2.api.usage).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        stats: mockStats
      });
    });

    it('should handle stats retrieval errors', async () => {
      const error = new Error('Stats unavailable');
      cloudinary.v2 = {
        api: {
          usage: jest.fn().mockRejectedValue(error)
        }
      };

      await getMediaStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: error.message });
    });
  });
});
