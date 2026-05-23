import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiUpload, FiImage, FiVideo, FiFile, FiTrash2, FiEdit3,
  FiDownload, FiCopy, FiSearch, FiFilter, FiGrid, FiList,
  FiPlay, FiPause, FiVolume2, FiMaximize2, FiCrop, FiZap
} from "react-icons/fi";

const MediaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  position: relative;
`;

const MediaHeader = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  flex: 1;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  outline: none;
  margin-left: 0.5rem;
  flex: 1;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ToolButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#667eea' : 'transparent'};
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const DropOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.1);
  border: 3px dashed #667eea;
  border-radius: 12px;
  margin: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  pointer-events: none;
`;

const DropZone = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 3rem 2rem;
  margin: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.viewMode === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr'};
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
`;

const MediaItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  height: fit-content;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const MediaPreview = styled.div`
  width: 100%;
  height: ${props => props.viewMode === 'grid' ? '150px' : '80px'};
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaInfo = styled.div`
  padding: 1rem;
`;

const MediaTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const MediaMeta = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MediaActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${MediaItem}:hover & {
    opacity: 1;
  }
`;

const ActionBtn = styled(motion.button)`
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 4px;
  color: white;
  padding: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(102, 126, 234, 0.7);
  }
`;

const MediaModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled(motion.div)`
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0 1rem;
`;

const FilterTab = styled(motion.button)`
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    border-color: #667eea;
  }
`;

const UploadProgress = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 8px;
  padding: 1rem;
  z-index: 100;
  min-width: 300px;
`;

function MediaLibrary({ article, updateArticle, mediaAPI }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  
  // Mock data with some initial media files
  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      type: 'image',
      name: 'hero-image.jpg',
      url: 'https://picsum.photos/400/300?random=1',
      size: '2.4 MB',
      uploaded: '2 days ago',
      tags: ['hero', 'featured'],
      alt: 'Hero image for the article'
    },
    {
      id: 2,
      type: 'video',
      name: 'demo-video.mp4',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      size: '15.2 MB',
      uploaded: '1 week ago',
      tags: ['demo', 'tutorial'],
      duration: '2:34'
    },
    {
      id: 3,
      type: 'document',
      name: 'research-notes.pdf',
      size: '890 KB',
      uploaded: '3 days ago',
      tags: ['research', 'notes']
    }
  ]);

  const fileInputRef = useRef();

  // Properly handle drag and drop events
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only hide overlay if we're leaving the container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragActive(false);
    }
  }, []);

  const handleFileUpload = async (files) => {
    setUploading(true);
    setUploadProgress([]);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Update progress
        setUploadProgress(prev => [
          ...prev,
          { name: file.name, status: 'uploading', progress: 0 }
        ]);
        
        console.log('MediaLibrary: Uploading file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });
        
        let uploadResult;
        
        if (mediaAPI) {
          // Use real mediaAPI for Cloudinary upload
          uploadResult = await mediaAPI.uploadFile(file, 'blog-articles');
        } else {
          // Fallback to mock upload
          await new Promise(resolve => setTimeout(resolve, 1000));
          uploadResult = {
            media: {
              _id: Date.now() + Math.random(),
              originalName: file.name,
              url: URL.createObjectURL(file)
            }
          };
        }
        
        const newMedia = {
          id: uploadResult.media?._id || Date.now() + Math.random(),
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          name: uploadResult.media?.originalName || file.name,
          url: uploadResult.media?.url || URL.createObjectURL(file),
          size: formatFileSize(file.size),
          uploaded: 'Just now',
          tags: [],
          cloudinaryId: uploadResult.media?.cloudinaryId
        };
        
        setMediaFiles(prev => [newMedia, ...prev]);
        
        // Update progress to complete
        setUploadProgress(prev => 
          prev.map(item => 
            item.name === file.name 
              ? { ...item, status: 'complete', progress: 100 }
              : item
          )
        );
        
      } catch (error) {
        console.error('Upload failed:', error);
        
        // Update progress to failed
        setUploadProgress(prev => 
          prev.map(item => 
            item.name === file.name 
              ? { ...item, status: 'failed', progress: 0 }
              : item
          )
        );
        
        // Still add the file with local URL
        const newMedia = {
          id: Date.now() + Math.random(),
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          name: file.name,
          url: URL.createObjectURL(file),
          size: formatFileSize(file.size),
          uploaded: 'Just now (upload failed)',
          tags: [],
          error: true
        };
        
        setMediaFiles(prev => [newMedia, ...prev]);
      }
    }
    
    // Clear progress after a delay
    setTimeout(() => {
      setUploadProgress([]);
      setUploading(false);
    }, 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaFiles.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const insertMedia = (media) => {
    let markdown;
    if (media.type === 'image') {
      markdown = `![${media.alt || media.name}](${media.url})`;
    } else if (media.type === 'video') {
      markdown = `\n\n<video controls>\n  <source src="${media.url}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n\n`;
    } else {
      markdown = `[${media.name}](${media.url})`;
    }
    
    updateArticle({
      content: (article.content || '') + '\n' + markdown
    });
  };

  const deleteMedia = (mediaId) => {
    setMediaFiles(prev => prev.filter(item => item.id !== mediaId));
  };

  const renderMediaIcon = (type) => {
    switch (type) {
      case 'image': return <FiImage size={24} />;
      case 'video': return <FiVideo size={24} />;
      default: return <FiFile size={24} />;
    }
  };

  return (
    <MediaContainer
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <MediaHeader>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Media Library</h3>
        
        <SearchBar>
          <FiSearch size={16} color="rgba(255, 255, 255, 0.5)" />
          <SearchInput
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ToolButton onClick={() => fileInputRef.current?.click()}>
            <FiUpload size={16} />
            Upload
          </ToolButton>
          
          <ToolButton 
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid size={16} />
          </ToolButton>
          
          <ToolButton 
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <FiList size={16} />
          </ToolButton>
        </div>
      </MediaHeader>

      <FilterTabs>
        {[
          { id: 'all', label: 'All Files' },
          { id: 'image', label: 'Images' },
          { id: 'video', label: 'Videos' },
          { id: 'document', label: 'Documents' }
        ].map(filter => (
          <FilterTab
            key={filter.id}
            active={filterType === filter.id}
            onClick={() => setFilterType(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </FilterTab>
        ))}
      </FilterTabs>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
      />

      <ContentArea>
        {/* Drag and Drop Overlay */}
        <AnimatePresence>
          {isDragActive && (
            <DropOverlay
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <FiUpload size={64} style={{ color: '#667eea', marginBottom: '1rem' }} />
              <h2 style={{ margin: 0, marginBottom: '0.5rem', color: '#667eea' }}>
                Drop files here to upload
              </h2>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Images, videos, PDFs, and documents supported
              </p>
            </DropOverlay>
          )}
        </AnimatePresence>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploading && uploadProgress.length > 0 && (
            <UploadProgress
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
            >
              <h4 style={{ margin: '0 0 1rem 0', color: '#667eea' }}>Uploading files...</h4>
              {uploadProgress.map((item, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.name}</span>
                    <span style={{ 
                      fontSize: '0.625rem',
                      color: item.status === 'complete' ? '#10b981' : 
                             item.status === 'failed' ? '#ef4444' : '#667eea'
                    }}>
                      {item.status === 'complete' ? 'Complete' : 
                       item.status === 'failed' ? 'Failed' : 'Uploading...'}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: item.status === 'complete' ? '100%' : 
                             item.status === 'failed' ? '0%' : '60%',
                      height: '100%',
                      background: item.status === 'complete' ? '#10b981' : 
                                 item.status === 'failed' ? '#ef4444' : '#667eea',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </UploadProgress>
          )}
        </AnimatePresence>

        {mediaFiles.length === 0 ? (
          <DropZone
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUpload size={48} style={{ marginBottom: '1rem', opacity: 0.6 }} />
            <h3>Drop files here or click to upload</h3>
            <p style={{ opacity: 0.7, margin: '0.5rem 0' }}>
              Supports images, videos, PDFs, and documents
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>
              Max file size: 100MB
            </p>
          </DropZone>
        ) : (
          <MediaGrid viewMode={viewMode}>
            {filteredMedia.map((media) => (
              <MediaItem
                key={media.id}
                viewMode={viewMode}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedMedia(media)}
              >
                <MediaPreview viewMode={viewMode}>
                  {media.type === 'image' ? (
                    <MediaImage 
                      src={media.url} 
                      alt={media.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div style={{ color: 'white', opacity: 0.8 }}>
                      {renderMediaIcon(media.type)}
                    </div>
                  )}
                  
                  <MediaActions>
                    <ActionBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        insertMedia(media);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiCopy size={12} />
                    </ActionBtn>
                    <ActionBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMedia(media.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiTrash2 size={12} />
                    </ActionBtn>
                  </MediaActions>
                </MediaPreview>
                
                <MediaInfo>
                  <MediaTitle>{media.name}</MediaTitle>
                  <MediaMeta>
                    <span>{media.size}</span>
                    <span>{media.uploaded}</span>
                  </MediaMeta>
                  {media.tags && media.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {media.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.625rem',
                            background: 'rgba(102, 126, 234, 0.2)',
                            color: '#667eea',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '12px',
                            marginRight: '0.25rem'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </MediaInfo>
              </MediaItem>
            ))}
          </MediaGrid>
        )}
      </ContentArea>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaModal onClick={() => setSelectedMedia(null)}>
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ModalHeader>
                <h3 style={{ margin: 0 }}>{selectedMedia.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ToolButton onClick={() => insertMedia(selectedMedia)}>
                    <FiCopy size={16} />
                    Insert
                  </ToolButton>
                  <ToolButton onClick={() => setSelectedMedia(null)}>
                    ×
                  </ToolButton>
                </div>
              </ModalHeader>
              
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.name}
                    style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px' }}
                  />
                ) : selectedMedia.type === 'video' ? (
                  <video
                    controls
                    style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px' }}
                  >
                    <source src={selectedMedia.url} type="video/mp4" />
                  </video>
                ) : (
                  <div style={{ padding: '3rem' }}>
                    {renderMediaIcon(selectedMedia.type)}
                    <p style={{ marginTop: '1rem' }}>
                      {selectedMedia.name} • {selectedMedia.size}
                    </p>
                  </div>
                )}
              </div>
            </ModalContent>
          </MediaModal>
        )}
      </AnimatePresence>
    </MediaContainer>
  );
}

export default MediaLibrary;