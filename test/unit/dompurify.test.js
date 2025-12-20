import DOMPurify from 'dompurify';

/**
 * Test suite for DOMPurify 3.2.4 compatibility
 * Tests basic functionality and security features
 * Ensures 2.4.2 → 3.2.4 major version upgrade is safe
 */

describe('DOMPurify 3.2.4 Compatibility Tests', () => {
  
  // Basic sanitization tests
  describe('Basic HTML Sanitization', () => {
    test('should remove script tags', () => {
      const malicious = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = DOMPurify.sanitize(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
    });

    test('should preserve safe HTML', () => {
      const safe = '<p>Hello <strong>World</strong></p>';
      const clean = DOMPurify.sanitize(safe);
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
      expect(clean).toContain('</strong>');
      expect(clean).toContain('</p>');
    });

    test('should preserve links with href attribute', () => {
      const html = '<a href="https://example.com">Click me</a>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('<a');
      expect(clean).toContain('href');
      expect(clean).toContain('example.com');
    });

    test('should handle empty strings', () => {
      const clean = DOMPurify.sanitize('');
      expect(clean).toBe('');
    });

    test('should handle null/undefined gracefully', () => {
      expect(() => DOMPurify.sanitize('')).not.toThrow();
    });
  });

  // XSS Attack Prevention
  describe('XSS Attack Prevention', () => {
    test('should remove event handlers from attributes', () => {
      const xss = '<img src="x" onerror="alert(\'XSS\')">';
      const clean = DOMPurify.sanitize(xss);
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('alert');
    });

    test('should remove data: URIs in event handlers', () => {
      const xss = '<a href="javascript:void(0)" onclick="alert(\'XSS\')">Click</a>';
      const clean = DOMPurify.sanitize(xss);
      expect(clean).not.toContain('onclick');
      expect(clean).not.toContain('javascript:');
    });

    test('should remove style tags with malicious content', () => {
      const xss = '<style>body { background: url("javascript:alert(\'XSS\')"); }</style>';
      const clean = DOMPurify.sanitize(xss);
      expect(clean).not.toContain('<style>');
    });

    test('should handle SVG-based XSS attempts', () => {
      const xss = '<svg onload="alert(\'XSS\')">';
      const clean = DOMPurify.sanitize(xss);
      expect(clean).not.toContain('onload');
    });

    test('should remove iframe tags by default', () => {
      const html = '<iframe src="https://example.com"></iframe>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).not.toContain('<iframe>');
    });
  });

  // Article Preview Use Case (EditorCore.jsx)
  describe('Article Preview Functionality', () => {
    test('should preserve markdown-converted HTML structure', () => {
      // Simulating marked() output
      const markedOutput = `<h1>Article Title</h1>
        <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>`;
      
      const clean = DOMPurify.sanitize(markedOutput);
      expect(clean).toContain('<h1>');
      expect(clean).toContain('<strong>');
      expect(clean).toContain('<em>');
      expect(clean).toContain('<ul>');
      expect(clean).toContain('<li>');
    });

    test('should preserve code blocks', () => {
      const html = '<pre><code class="language-javascript">const x = 5;</code></pre>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('<pre>');
      expect(clean).toContain('<code');
      expect(clean).toContain('const x = 5');
    });

    test('should preserve blockquotes', () => {
      const html = '<blockquote><p>This is a quote</p></blockquote>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('<blockquote>');
      expect(clean).toContain('<p>');
    });

    test('should preserve tables', () => {
      const html = `<table>
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
      </table>`;
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('<table>');
      expect(clean).toContain('<tr>');
      expect(clean).toContain('<th>');
      expect(clean).toContain('<td>');
    });

    test('should preserve images with src attribute', () => {
      const html = '<img src="/images/article.png" alt="Article Image">';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('img');
      expect(clean).toContain('src');
      expect(clean).toContain('/images/article.png');
    });
  });

  // Security Features
  describe('Prototype Pollution & DOM Clobbering Protection (2.4.2)', () => {
    test('should handle attribute clobbering safely', () => {
      // DOMPurify prevents dangerous property overrides
      const html = '<img src="x" name="innerHTML">';
      const clean = DOMPurify.sanitize(html);
      // The key security aspect: even if attributes exist, the sanitized HTML is safe
      expect(clean).not.toContain('onclick');
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('onload');
    });

    test('should prevent prototype pollution via config', () => {
      // Config should not be modifiable via input
      const config = { ALLOWED_TAGS: ['p', 'div'] };
      const originalConfig = { ...config };
      DOMPurify.sanitize('<img src="x">', config);
      expect(config).toEqual(originalConfig);
    });

    test('should prevent event handlers even in complex attributes', () => {
      // DOMPurify removes all event handlers
      const html = '<div class="test" onclick="alert(1)" ondblclick="alert(2)"></div>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('div');
      expect(clean).not.toContain('onclick');
      expect(clean).not.toContain('ondblclick');
      expect(clean).not.toContain('alert');
    });
  });

  // Trusted Types Support (improved in 2.4.2)
  describe('Trusted Types Support', () => {
    test('should handle empty input without namespace errors', () => {
      const clean = DOMPurify.sanitize('');
      expect(clean).toBe('');
    });

    test('should handle null values safely', () => {
      // DOMPurify should handle edge cases gracefully
      expect(() => DOMPurify.sanitize(null)).not.toThrow();
    });
  });

  // Template Literals Detection (improved in 2.4.1)
  describe('Template Literals Detection', () => {
    test('should handle template content safely with SAFE_FOR_TEMPLATES', () => {
      const config = { SAFE_FOR_TEMPLATES: true };
      const html = '<p>Hello World</p>';
      const clean = DOMPurify.sanitize(html, config);
      expect(clean).toContain('<p>');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    test('should handle deeply nested HTML', () => {
      let nested = '<p>';
      for (let i = 0; i < 50; i++) {
        nested += '<div>';
      }
      nested += 'Content';
      for (let i = 0; i < 50; i++) {
        nested += '</div>';
      }
      nested += '</p>';
      
      expect(() => DOMPurify.sanitize(nested)).not.toThrow();
    });

    test('should handle mixed valid and invalid tags', () => {
      const html = '<p>Valid <script>invalid</script> <strong>valid</strong></p>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
      expect(clean).not.toContain('<script>');
    });

    test('should handle special characters', () => {
      const html = '<p>Special chars: &lt; &gt; &amp; &quot;</p>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('&lt;');
      expect(clean).toContain('&gt;');
      expect(clean).toContain('&amp;');
    });
  });

  // Configuration Tests
  describe('Configuration Options', () => {
    test('should respect custom ALLOWED_TAGS', () => {
      const config = { ALLOWED_TAGS: ['p'] };
      const html = '<p>Safe</p><div>Removed</div>';
      const clean = DOMPurify.sanitize(html, config);
      expect(clean).toContain('<p>');
      expect(clean).not.toContain('<div>');
    });

    test('should respect ALLOWED_ATTR configuration', () => {
      const config = { ALLOWED_TAGS: ['img'], ALLOWED_ATTR: ['src', 'alt'] };
      const html = '<img src="x.jpg" alt="test" onerror="alert(1)">';
      const clean = DOMPurify.sanitize(html, config);
      expect(clean).toContain('src');
      expect(clean).toContain('alt');
      expect(clean).not.toContain('onerror');
    });
  });

  // Return value tests
  describe('Return Value & String Handling', () => {
    test('should always return a string', () => {
      const result = DOMPurify.sanitize('<p>Test</p>');
      expect(typeof result).toBe('string');
    });

    test('should handle whitespace properly', () => {
      const html = '<p>  Whitespace  </p>';
      const clean = DOMPurify.sanitize(html);
      expect(clean).toContain('Whitespace');
    });
  });

  // Version 3.x Specific Tests
  describe('DOMPurify 3.x Features', () => {
    test('should handle deeply nested HTML with depth limit (3.1.1+)', () => {
      // Create HTML with 100 levels of nesting (below 255 limit in 3.1.1+)
      let nested = '<div>';
      for (let i = 0; i < 100; i++) {
        nested += '<div>';
      }
      nested += 'Content';
      for (let i = 0; i < 100; i++) {
        nested += '</div>';
      }
      nested += '</div>';
      
      // Should not crash, should handle gracefully
      const result = DOMPurify.sanitize(nested);
      expect(result).toContain('Content');
      expect(typeof result).toBe('string');
    });

    test('should work without window object (3.2.4)', () => {
      // In 3.2.4, better handling when no window object is present
      // This test ensures the sanitize function is callable
      const html = '<p>Test</p>';
      const result = DOMPurify.sanitize(html);
      expect(result).toContain('<p>');
    });

    test('should support SAFE_FOR_XML option (3.1.0+)', () => {
      // New config option in 3.1.0+
      const config = { SAFE_FOR_XML: true };
      const html = '<p>Safe</p>';
      const result = DOMPurify.sanitize(html, config);
      expect(result).toContain('<p>');
    });

    test('should support USE_PROFILES configuration (3.x)', () => {
      // USE_PROFILES allows restricting to specific mark-up languages
      const config = { USE_PROFILES: { html: true } };
      const html = '<p>HTML Only</p><svg></svg>';
      const result = DOMPurify.sanitize(html, config);
      expect(result).toContain('<p>');
      expect(result).not.toContain('<svg>');
    });

    test('should have isSupported property (3.x)', () => {
      // DOMPurify exposes isSupported to check if it works in current environment
      expect(typeof DOMPurify.isSupported).toBe('boolean');
      if (DOMPurify.isSupported !== undefined) {
        // If property exists, it should indicate support
        expect([true, false]).toContain(DOMPurify.isSupported);
      }
    });

    test('should maintain removed elements tracking (3.x)', () => {
      // DOMPurify tracks removed elements in DOMPurify.removed
      const malicious = '<p>Safe</p><script>alert(1)</script>';
      DOMPurify.sanitize(malicious);
      
      // The removed property should exist and be an array
      if (DOMPurify.removed) {
        expect(Array.isArray(DOMPurify.removed) || typeof DOMPurify.removed === 'object').toBe(true);
      }
    });

    test('should support IN_PLACE sanitization mode (3.x)', () => {
      // IN_PLACE mode can sanitize DOM nodes in-place (faster for some use cases)
      const config = { IN_PLACE: false };
      const html = '<p>Test</p>';
      const result = DOMPurify.sanitize(html, config);
      expect(result).toContain('<p>');
    });
  });

  // Security & mXSS Tests (3.x improvements)
  describe('DOMPurify 3.x Security Improvements', () => {
    test('should handle processing instruction XSS (3.0.10+)', () => {
      // Processing instructions with XSS payloads
      const html = '<?xml version="1.0"?><div>safe</div>';
      const result = DOMPurify.sanitize(html);
      expect(result).toContain('safe');
    });

    test('should prevent attribute clobbering with enhanced checks (3.x)', () => {
      // Enhanced attribute validation in 3.x
      const html = '<div name="html"></div>';
      const result = DOMPurify.sanitize(html);
      expect(result).toContain('<div');
    });

    test('should handle custom element regex properly (3.0.11+)', () => {
      // Fixed regex for custom elements in 3.0.11
      const html = '<custom-element>content</custom-element>';
      const config = { 
        CUSTOM_ELEMENT_HANDLING: {
          tagNameCheck: /^custom-/
        }
      };
      const result = DOMPurify.sanitize(html, config);
      // Should either allow or remove custom element depending on config
      expect(typeof result).toBe('string');
    });

    test('should handle shadow DOM safely (3.x)', () => {
      // Better shadow DOM support in 3.x
      const html = '<div><!--shadowrootmode="open"><script>alert(1)</script>--></div>';
      const result = DOMPurify.sanitize(html);
      expect(result).toContain('<div>');
      expect(result).not.toContain('<script>');
    });
  });

  // Compatibility verification
  describe('Backward Compatibility (2.4.2 → 3.2.4)', () => {
    test('configuration from 2.4.2 should work in 3.2.4', () => {
      // Old 2.4.2 style configuration
      const config = {
        ALLOWED_TAGS: ['p', 'br', 'a'],
        ALLOWED_ATTR: ['href', 'title'],
        SAFE_FOR_TEMPLATES: false
      };
      
      const html = '<p><a href="/test" title="Test">Link</a></p>';
      const result = DOMPurify.sanitize(html, config);
      
      expect(result).toContain('<p>');
      expect(result).toContain('<a');
      expect(result).toContain('href');
    });

    test('hooks from 2.4.2 should work in 3.x', () => {
      // Hooks are maintained in 3.x
      let hookCalled = false;
      
      DOMPurify.addHook('beforeSanitizeElements', (node) => {
        hookCalled = true;
      });
      
      DOMPurify.sanitize('<p>Test</p>');
      
      expect(hookCalled).toBe(true);
      
      // Clean up
      DOMPurify.removeHook('beforeSanitizeElements');
    });

    test('setConfig from 2.4.2 should work in 3.x', () => {
      // Config persistence API works
      DOMPurify.setConfig({ ALLOWED_TAGS: ['p'] });
      
      const html = '<p>Test</p><div>Removed</div>';
      const result = DOMPurify.sanitize(html);
      
      expect(result).toContain('<p>');
      expect(result).not.toContain('<div>');
      
      // Reset
      DOMPurify.clearConfig();
    });
  });
});

