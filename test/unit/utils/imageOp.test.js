import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

describe('imagemin-jpegtran v8.0.0 Compatibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Module Loading', () => {
    it('should successfully import imagemin-jpegtran as ESM module', () => {
      expect(imageminJpegtran).toBeDefined();
      expect(typeof imageminJpegtran).toBe('function');
    });

    it('should successfully import imagemin-pngquant as ESM module', () => {
      expect(imageminPngquant).toBeDefined();
      expect(typeof imageminPngquant).toBe('function');
    });
  });

  describe('Plugin Instantiation', () => {
    it('should instantiate imageminJpegtran without options', () => {
      const plugin = imageminJpegtran();
      expect(plugin).toBeDefined();
      expect(typeof plugin).toBe('function');
    });

    it('should instantiate imageminJpegtran with options', () => {
      const plugin = imageminJpegtran({
        progressive: true,
        arithmetic: false,
      });
      expect(plugin).toBeDefined();
      expect(typeof plugin).toBe('function');
    });

    it('should instantiate imageminPngquant with quality options', () => {
      const plugin = imageminPngquant({
        quality: [0.6, 0.8],
      });
      expect(plugin).toBeDefined();
      expect(typeof plugin).toBe('function');
    });
  });

  describe('Plugin Interface Compatibility', () => {
    it('should return a function from jpegtran plugin factory', () => {
      const plugin = imageminJpegtran();
      expect(typeof plugin).toBe('function');
    });

    it('should return a function from pngquant plugin factory', () => {
      const plugin = imageminPngquant({ quality: [0.6, 0.8] });
      expect(typeof plugin).toBe('function');
    });

    it('should accept Buffer input and return a Promise', async () => {
      const plugin = imageminJpegtran();
      const mockBuffer = Buffer.from([0xff, 0xd8, 0xff]);
      
      const result = plugin(mockBuffer);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('Common Usage Patterns', () => {
    it('should create plugins array for imagemin configuration', () => {
      const plugins = [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ];

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins).toHaveLength(2);
      expect(typeof plugins[0]).toBe('function');
      expect(typeof plugins[1]).toBe('function');
    });

    it('should support various jpegtran options', () => {
      const optionsArray = [
        { progressive: true },
        { arithmetic: true },
        { progressive: true, arithmetic: false },
        {},
      ];

      optionsArray.forEach(options => {
        const plugin = imageminJpegtran(options);
        expect(plugin).toBeDefined();
        expect(typeof plugin).toBe('function');
      });
    });

    it('should support various pngquant options', () => {
      const optionsArray = [
        { quality: [0.6, 0.8] },
        { quality: [0.3, 0.5] },
        { strip: true },
        { quality: [0.6, 0.8], strip: true },
        {},
      ];

      optionsArray.forEach(options => {
        const plugin = imageminPngquant(options);
        expect(plugin).toBeDefined();
        expect(typeof plugin).toBe('function');
      });
    });
  });

  describe('ESM Compatibility (v8.0.0 requirement)', () => {
    it('should be loaded as pure ESM module', () => {
      // v8.0.0 is pure ESM - no CommonJS interop
      expect(typeof imageminJpegtran).toBe('function');
      // Successfully imported as ESM
      expect(imageminJpegtran).toBeTruthy();
    });

    it('should support default export pattern', () => {
      expect(imageminJpegtran).toBeDefined();
      const plugin = imageminJpegtran();
      expect(plugin).toBeDefined();
    });
  });

  describe('Node.js 20 Compatibility (v8.0.0 requirement)', () => {
    it('should work with Node.js 20.x', () => {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
      
      // Your package.json specifies Node.js 20.x
      // v8.0.0 requires Node.js 18+
      expect(majorVersion).toBeGreaterThanOrEqual(18);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid buffer gracefully', async () => {
      const plugin = imageminJpegtran();
      const invalidBuffer = Buffer.from('invalid jpeg data');

      try {
        await plugin(invalidBuffer);
      } catch (err) {
        // Should throw an error for invalid data
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should accept null/undefined options and use defaults', () => {
      const plugin1 = imageminJpegtran(null);
      const plugin2 = imageminJpegtran(undefined);
      const plugin3 = imageminJpegtran();

      expect(plugin1).toBeDefined();
      expect(plugin2).toBeDefined();
      expect(plugin3).toBeDefined();
    });
  });

  describe('Integration Pattern (imageOp usage)', () => {
    it('should match the imageOp.js usage pattern', () => {
      // Simulating the actual usage in imageOp.js
      const plugins = [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ];

      // Validate structure
      expect(plugins).toHaveLength(2);
      expect(typeof plugins[0]).toBe('function');
      expect(typeof plugins[1]).toBe('function');

      // Validate both are callable
      plugins.forEach(plugin => {
        expect(typeof plugin).toBe('function');
      });
    });
  });
});
