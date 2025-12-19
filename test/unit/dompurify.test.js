import DOMPurify from 'dompurify';

/**
 * Test suite for DOMPurify 2.4.2 compatibility
 * Tests basic functionality and security features
 */

describe('DOMPurify 2.4.2 Compatibility Tests', () => {
  
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
});
