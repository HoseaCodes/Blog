import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiEdit3, FiEye, FiMonitor, FiTablet, FiSmartphone, FiMaximize2,
  FiType, FiCode, FiLayers, FiFold, FiUnfold, FiMessageSquare,
  FiRefreshCw, FiCopy, FiDownload, FiSettings, FiMic, FiZap
} from "react-icons/fi";
import marked from "marked";
import DOMPurify from "dompurify";
import slugify from "slugify";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(15, 15, 35, 0.8);
`;

const EditorToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 1rem;
`;

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToolButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#667eea' : '#ffffff'};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
    color: #667eea;
  }
`;

const EditorLayout = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    if (props.mode === 'write') return '1fr';
    if (props.mode === 'preview') return '0 1fr';
    return '1fr 1fr';
  }};
  flex: 1;
  overflow: hidden;
`;

const EditorPane = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const PreviewPane = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.previewMode === 'mobile' ? '#000' : 'rgba(255, 255, 255, 0.05)'};
`;

const EditorHeader = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleInput = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  width: 100%;
  margin-bottom: 0.5rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
  }
`;

const SubtitleInput = styled.input`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
  font-weight: 400;
  width: 100%;
  margin-bottom: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
  }
`;

const MarkdownEditor = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1.5rem;
  resize: none;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  font-family: ${props => props.previewMode === 'mobile' ? 'system-ui' : 'Inter'};
  font-size: ${props => props.previewMode === 'mobile' ? '0.875rem' : '1rem'};
  line-height: 1.7;
  color: #ffffff;

  h1, h2, h3, h4, h5, h6 {
    color: #667eea;
    margin: 1.5rem 0 1rem 0;
    font-weight: 700;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }

  p {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.9);
  }

  pre {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  code {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
  }

  blockquote {
    border-left: 4px solid #667eea;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 0 8px 8px 0;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th, td {
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: rgba(102, 126, 234, 0.2);
    font-weight: 600;
  }
`;

const WordCount = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: space-between;
`;

const CommentOverlay = styled(motion.div)`
  position: absolute;
  right: 10px;
  top: ${props => props.y}px;
  background: rgba(102, 126, 234, 0.9);
  border: 1px solid #667eea;
  border-radius: 8px;
  padding: 0.5rem;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const AIQuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const VoiceRecordButton = styled(motion.button)`
  background: ${props => props.recording ? 'linear-gradient(45deg, #ef4444, #dc2626)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.recording ? 'linear-gradient(45deg, #dc2626, #b91c1c)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const SelectionIndicator = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #667eea;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #667eea;
  pointer-events: none;
  z-index: 10;
`;

const ToolbarSelectionBadge = styled.div`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #667eea;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EditorCore = forwardRef(({ 
  article, 
  updateArticle, 
  editorMode, 
  setEditorMode, 
  previewMode, 
  setPreviewMode, 
  aiAPI, 
  mediaAPI,
  onTextSelection 
}, ref) => {
  const [viewMode, setViewMode] = useState('split'); // write, split, preview
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [comments, setComments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [foldedSections, setFoldedSections] = useState(new Set());
  
  const editorRef = useRef();
  const previewRef = useRef();

  // Capture text selection whenever it changes
  const handleTextSelection = useCallback(() => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value.substring(start, end);
      
      setSelectedText(text);
      setSelectionRange({ start, end });
      
      // Notify parent component about selection
      if (onTextSelection) {
        onTextSelection(text, { start, end });
      }
    }
  }, [onTextSelection]);

  // Add selection event listeners
  useEffect(() => {
    const textarea = editorRef.current;
    if (textarea) {
      textarea.addEventListener('mouseup', handleTextSelection);
      textarea.addEventListener('keyup', handleTextSelection);
      textarea.addEventListener('select', handleTextSelection);
      
      return () => {
        textarea.removeEventListener('mouseup', handleTextSelection);
        textarea.removeEventListener('keyup', handleTextSelection);
        textarea.removeEventListener('select', handleTextSelection);
      };
    }
  }, [handleTextSelection]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getSelectedText: () => selectedText,
    getSelectionRange: () => selectionRange,
    insertText: (text, replaceSelection = false) => {
      if (editorRef.current) {
        const textarea = editorRef.current;
        const start = replaceSelection ? selectionRange.start : textarea.selectionStart;
        const end = replaceSelection ? selectionRange.end : textarea.selectionEnd;
        
        const newContent = 
          textarea.value.substring(0, start) + 
          text + 
          textarea.value.substring(end);
        
        updateArticle({ content: newContent });
        
        // Set cursor position after inserted text
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + text.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    },
    replaceSelectedText: (newText) => {
      if (editorRef.current && selectionRange.start !== selectionRange.end) {
        const textarea = editorRef.current;
        const newContent = 
          textarea.value.substring(0, selectionRange.start) + 
          newText + 
          textarea.value.substring(selectionRange.end);
        
        updateArticle({ content: newContent });
        
        // Clear selection and set cursor after new text
        setTimeout(() => {
          textarea.focus();
          const newPosition = selectionRange.start + newText.length;
          textarea.setSelectionRange(newPosition, newPosition);
          setSelectedText('');
          setSelectionRange({ start: 0, end: 0 });
        }, 0);
      }
    },
    clearSelection: () => {
      setSelectedText('');
      setSelectionRange({ start: 0, end: 0 });
    },
    focusEditor: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  }), [selectedText, selectionRange, updateArticle]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    updateArticle({
      title,
      slug: slugify(title, { lower: true, strict: true })
    });
  };

  const handleSubtitleChange = (e) => {
    updateArticle({ subtitle: e.target.value });
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    updateArticle({
      content,
      metadata: {
        ...article.metadata,
        wordCount,
        readingTime
      }
    });
  };

  const getCleanHTML = useCallback(() => {
    const html = marked(article.content || '');
    return DOMPurify.sanitize(html);
  }, [article.content]);

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = `${prefix}${selectedText}${suffix}`;
    
    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    updateArticle({ content: newContent });
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const toggleVoiceRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice recording not supported in your browser');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic would go here
    } else {
      try {
        setIsRecording(true);
        // Start recording logic would go here
        // This would integrate with speech-to-text API
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setIsRecording(false);
      }
    }
  };

  const addComment = (lineNumber) => {
    const comment = prompt('Add comment:');
    if (comment) {
      setComments([...comments, {
        id: Date.now(),
        content: comment,
        line: lineNumber,
        author: 'Current User',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <EditorContainer>
      <EditorToolbar>
        <ToolGroup>
          <ToolButton 
            active={viewMode === 'write'}
            onClick={() => setViewMode('write')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiEdit3 size={16} />
            Write
          </ToolButton>
          <ToolButton 
            active={viewMode === 'split'}
            onClick={() => setViewMode('split')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiLayers size={16} />
            Split
          </ToolButton>
          <ToolButton 
            active={viewMode === 'preview'}
            onClick={() => setViewMode('preview')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiEye size={16} />
            Preview
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolButton 
            active={previewMode === 'desktop'}
            onClick={() => setPreviewMode('desktop')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMonitor size={16} />
          </ToolButton>
          <ToolButton 
            active={previewMode === 'tablet'}
            onClick={() => setPreviewMode('tablet')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiTablet size={16} />
          </ToolButton>
          <ToolButton 
            active={previewMode === 'mobile'}
            onClick={() => setPreviewMode('mobile')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSmartphone size={16} />
          </ToolButton>
        </ToolGroup>

        {/* Selection Indicator in Toolbar */}
        <AnimatePresence>
          {selectedText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ToolbarSelectionBadge>
                <FiEdit3 size={12} />
                {selectedText.length} chars selected
              </ToolbarSelectionBadge>
            </motion.div>
          )}
        </AnimatePresence>

        <AIQuickActions>
          <ToolButton 
            onClick={() => insertMarkdown('## ', '')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            H2
          </ToolButton>
          <ToolButton 
            onClick={() => insertMarkdown('- ', '')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            List
          </ToolButton>
          <VoiceRecordButton 
            recording={isRecording}
            onClick={toggleVoiceRecording}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMic size={18} />
          </VoiceRecordButton>
        </AIQuickActions>

        <ToolGroup>
          <ToolButton 
            onClick={() => setIsFullscreen(!isFullscreen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMaximize2 size={16} />
            {isFullscreen ? 'Exit' : 'Focus'}
          </ToolButton>
        </ToolGroup>
      </EditorToolbar>

      <EditorLayout mode={viewMode}>
        {(viewMode === 'write' || viewMode === 'split') && (
          <EditorPane>
            <EditorHeader>
              <div style={{ flex: 1 }}>
                <TitleInput
                  placeholder="Enter your compelling title..."
                  value={article.title || ''}
                  onChange={handleTitleChange}
                />
                <SubtitleInput
                  placeholder="Add an engaging subtitle..."
                  value={article.subtitle || ''}
                  onChange={handleSubtitleChange}
                />
              </div>
            </EditorHeader>

            <MarkdownEditor
              ref={editorRef}
              placeholder="Start writing your article... Use markdown for formatting.

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List items
- More items

> Blockquotes for emphasis
```javascript
// Code blocks with syntax highlighting
const example = 'Hello World';
```

[Links](https://example.com) and images work too!"
              value={article.content || ''}
              onChange={handleContentChange}
              onSelect={handleTextSelection}
              spellCheck="true"
            />

            {/* Selection Indicator Overlay */}
            <AnimatePresence>
              {selectedText && (
                <SelectionIndicator
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedText.length} chars
                </SelectionIndicator>
              )}
            </AnimatePresence>

            <WordCount>
              <span>
                {article.metadata?.wordCount || 0} words • {article.metadata?.readingTime || 0} min read
              </span>
              <span>
                Line {(article.content || '').split('\n').length}
              </span>
            </WordCount>
          </EditorPane>
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <PreviewPane previewMode={previewMode}>
            <EditorHeader>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>
                Preview ({previewMode})
              </h3>
              <ToolButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiRefreshCw size={14} />
                Refresh
              </ToolButton>
            </EditorHeader>

            <PreviewContent 
              ref={previewRef}
              previewMode={previewMode}
              dangerouslySetInnerHTML={{ __html: getCleanHTML() }}
            />
          </PreviewPane>
        )}
      </EditorLayout>

      {/* Comments Overlay */}
      <AnimatePresence>
        {comments.map(comment => (
          <CommentOverlay
            key={comment.id}
            y={comment.line * 20}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {comment.author}
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {comment.content}
            </div>
          </CommentOverlay>
        ))}
      </AnimatePresence>
    </EditorContainer>
  );
});

EditorCore.displayName = 'EditorCore';

export default EditorCore;