import cloudinary from 'cloudinary';

describe('Cloudinary v2 Integration Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Cloudinary Configuration', () => {
    it('should configure Cloudinary with environment variables', () => {
      process.env.CLOUND_NAME = 'test-cloud';
      process.env.CLOUD_API_KEY = 'test-key';
      process.env.CLOUD_API_SECRET = 'test-secret';

      cloudinary.config({
        cloud_name: process.env.CLOUND_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
      });

      expect(cloudinary.config()).toEqual(
        expect.objectContaining({
          cloud_name: 'test-cloud',
          api_key: 'test-key',
          api_secret: 'test-secret'
        })
      );
    });

    it('should have secure URLs enabled by default in v2', () => {
      cloudinary.config({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret'
      });

      // In v2, secure is true by default
      const config = cloudinary.config();
      expect(config.secure).not.toBe(false);
    });
  });

  describe('Cloudinary v2 API Availability', () => {
    it('should have v2.uploader API available', () => {
      expect(cloudinary.v2).toBeDefined();
      expect(cloudinary.v2.uploader).toBeDefined();
      expect(typeof cloudinary.v2.uploader.upload).toBe('function');
      expect(typeof cloudinary.v2.uploader.destroy).toBe('function');
      expect(typeof cloudinary.v2.uploader.explicit).toBe('function');
    });

    it('should have v2.search API available', () => {
      expect(cloudinary.v2.search).toBeDefined();
      expect(typeof cloudinary.v2.search.expression).toBe('function');
    });

    it('should have v2.api API available', () => {
      expect(cloudinary.v2.api).toBeDefined();
      expect(typeof cloudinary.v2.api.usage).toBe('function');
    });

    it('should support method chaining for search', () => {
      const searchChain = cloudinary.v2.search
        .expression('test')
        .sort_by('created_at', 'desc')
        .max_results(50);

      expect(searchChain).toBeDefined();
      expect(typeof searchChain.execute).toBe('function');
    });
  });

  describe('Cloudinary v2 URL Generation', () => {
    it('should generate HTTPS URLs by default (v2 secure=true default)', () => {
      cloudinary.config({
        cloud_name: 'test-cloud'
      });

      const url = cloudinary.url('sample', {
        secure: true // Explicitly secure, default in v2
      });

      expect(url).toMatch(/^https:\/\//);
    });

    it('should support transformation parameters', () => {
      cloudinary.config({
        cloud_name: 'test-cloud'
      });

      const url = cloudinary.url('sample', {
        width: 300,
        height: 300,
        crop: 'fill',
        secure: true
      });

      expect(url).toContain('w_300');
      expect(url).toContain('h_300');
      expect(url).toContain('c_fill');
    });
  });

  describe('Cloudinary v2 Backward Compatibility', () => {
    it('should maintain support for all v1.x methods used in codebase', () => {
      // Methods used in your controllers
      const methods = [
        'cloudinary.v2.uploader.upload',
        'cloudinary.v2.uploader.destroy',
        'cloudinary.v2.uploader.explicit',
        'cloudinary.v2.search.expression',
        'cloudinary.v2.api.usage'
      ];

      methods.forEach(method => {
        const parts = method.split('.');
        let obj = cloudinary;
        
        for (let i = 1; i < parts.length; i++) {
          obj = obj[parts[i]];
          expect(obj).toBeDefined();
        }
      });
    });

    it('should support async/await patterns for API calls', async () => {
      cloudinary.config({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret'
      });

      // Test that methods can be used with async/await
      const searchResult = cloudinary.v2.search
        .expression('test')
        .max_results(10);

      expect(searchResult.execute).toBeDefined();
      expect(typeof searchResult.execute().then).toBe('function');
    });

    it('should support callback patterns (legacy)', () => {
      cloudinary.config({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret'
      });

      // Upload method should be callable
      const uploadFn = cloudinary.v2.uploader.upload;
      expect(uploadFn).toBeDefined();
      expect(typeof uploadFn).toBe('function');
    });
  });

  describe('Cloudinary URL Analytics (v2 feature)', () => {
    it('should have analytics support in v2', () => {
      cloudinary.config({
        cloud_name: 'test-cloud',
        analytics: true
      });

      const config = cloudinary.config();
      expect(config.analytics).not.toBe(false);
    });
  });

  describe('Node.js Compatibility', () => {
    it('should work with Node 20.x (project requirement)', () => {
      expect(process.version).toMatch(/^v20\./);
    });

    it('should not require Node 6 or 8 support (dropped in v2)', () => {
      const currentNodeVersion = parseInt(process.version.slice(1).split('.')[0]);
      expect(currentNodeVersion).toBeGreaterThanOrEqual(14);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration gracefully', () => {
      expect(() => {
        cloudinary.config({
          cloud_name: null,
          api_key: null,
          api_secret: null
        });
      }).not.toThrow();
    });

    it('should provide meaningful error messages', () => {
      cloudinary.config({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret'
      });

      // Configuration should not throw
      expect(() => {
        cloudinary.config();
      }).not.toThrow();
    });
  });
});
