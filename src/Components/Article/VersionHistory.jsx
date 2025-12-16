import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiClock, FiUser, FiEdit3, FiEye, FiRotateCcw, FiGitBranch,
  FiMoreHorizontal, FiTrash2, FiCopy, FiArrowRight
} from "react-icons/fi";
import moment from "moment";

const VersionContainer = styled.div`
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  overflow-y: auto;
  height: 100%;
`;

const VersionList = styled.div`
  margin-top: 1rem;
`;

const VersionItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const VersionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const VersionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const VersionNumber = styled.div`
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const VersionMeta = styled.div`
  font-size: 0.875rem;
`;

const Author = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Timestamp = styled.div`
  opacity: 0.7;
  font-size: 0.75rem;
`;

const VersionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

const VersionContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ChangesSummary = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
`;

const ChangesTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #667eea;
`;

const ChangesList = styled.ul`
  margin: 0;
  padding-left: 1rem;
  list-style: none;
  
  li {
    margin-bottom: 0.25rem;
    position: relative;
    
    &:before {
      content: "•";
      color: #667eea;
      position: absolute;
      left: -0.75rem;
    }
  }
`;

const CurrentBadge = styled.div`
  position: absolute;
  top: -8px;
  right: 1rem;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CompareModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
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
  width: 90%;
  max-width: 1000px;
  height: 80%;
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

const CompareView = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
`;

const ComparePane = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  border-right: ${props => props.isLeft ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
  
  svg {
    margin-bottom: 1rem;
  }
`;

function VersionHistory({ article, updateArticle, blogAPI }) {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState([]);
  const [realVersions, setRealVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real version history when component mounts
  useEffect(() => {
    if (blogAPI && article?.id) {
      fetchVersionHistory();
    }
  }, [article?.id, blogAPI]);

  const fetchVersionHistory = async () => {
    setLoading(true);
    try {
      const history = await blogAPI.getVersionHistory(article.id);
      setRealVersions(history.versions || []);
    } catch (error) {
      console.error('Failed to fetch version history:', error);
      setRealVersions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVersion = async (versionId) => {
    try {
      const result = await blogAPI.restoreVersion(article.id, versionId);
      if (result.article) {
        updateArticle(result.article);
        // Refresh version history after restore
        await fetchVersionHistory();
      }
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  // Use only real versions - no mock data
  const versions = realVersions.map(version => ({
    ...version,
    timestamp: moment(version.timestamp || version.createdAt)
  }));

  const restoreVersion = async (version) => {
    await handleRestoreVersion(version.id);
  };

  const compareWith = (version) => {
    if (compareVersions.length < 2 && !compareVersions.find(v => v.id === version.id)) {
      setCompareVersions([...compareVersions, version]);
      if (compareVersions.length === 1) {
        setCompareMode(true);
      }
    }
  };

  const clearCompare = () => {
    setCompareVersions([]);
    setCompareMode(false);
  };

  if (loading) {
    return (
      <VersionContainer>
        <LoadingState>
          <FiClock size={48} style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading Version History...</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Fetching article revisions
          </div>
        </LoadingState>
      </VersionContainer>
    );
  }
  
  if (!blogAPI || !article?.id) {
    return (
      <VersionContainer>
        <EmptyState>
          <FiClock size={48} style={{ opacity: 0.5 }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Version History Unavailable
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Save the article to start tracking version history
          </div>
        </EmptyState>
      </VersionContainer>
    );
  }
  
  if (!versions || versions.length === 0) {
    return (
      <VersionContainer>
        <EmptyState>
          <FiClock size={48} style={{ opacity: 0.5 }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            No Version History Yet
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Version history will be created as you save changes to this article
          </div>
        </EmptyState>
      </VersionContainer>
    );
  }

  return (
    <VersionContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea' }}>
          <FiClock />
          Version History ({versions.length})
        </h3>
        
        {compareVersions.length > 0 && (
          <ActionButton
            onClick={clearCompare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Compare ({compareVersions.length})
          </ActionButton>
        )}
      </div>

      <VersionList>
        <AnimatePresence>
          {versions.map((version, index) => (
            <VersionItem
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              {version.isCurrent && <CurrentBadge>Current</CurrentBadge>}
              
              <VersionHeader>
                <VersionInfo>
                  <VersionNumber>v{version.version || version.versionNumber || index + 1}</VersionNumber>
                  <VersionMeta>
                    <Author>{version.author || version.updatedBy || 'Unknown'}</Author>
                    <Timestamp>{version.timestamp ? version.timestamp.fromNow() : 'Unknown date'}</Timestamp>
                  </VersionMeta>
                </VersionInfo>

                <VersionActions>
                  <ActionButton
                    onClick={() => setSelectedVersion(version)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye size={12} />
                    View
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => compareWith(version)}
                    disabled={compareVersions.length >= 2}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiGitBranch size={12} />
                    Compare
                  </ActionButton>

                  {!version.isCurrent && (
                    <ActionButton
                      onClick={() => restoreVersion(version)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiRotateCcw size={12} />
                      Restore
                    </ActionButton>
                  )}
                </VersionActions>
              </VersionHeader>

              {version.changes && version.changes.length > 0 && (
                <ChangesSummary>
                  <ChangesTitle>Changes in this version:</ChangesTitle>
                  <ChangesList>
                    {version.changes.map((change, changeIndex) => (
                      <li key={changeIndex}>{change}</li>
                    ))}
                  </ChangesList>
                </ChangesSummary>
              )}
              
              {version.description && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', opacity: 0.9 }}>
                  {version.description}
                </div>
              )}
            </VersionItem>
          ))}
        </AnimatePresence>
      </VersionList>

      {/* Version Detail Modal */}
      <AnimatePresence>
        {selectedVersion && (
          <CompareModal onClick={() => setSelectedVersion(null)}>
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ModalHeader>
                <h3 style={{ margin: 0 }}>Version {selectedVersion.version}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => restoreVersion(selectedVersion)}>
                    <FiRotateCcw size={14} />
                    Restore
                  </ActionButton>
                  <ActionButton onClick={() => setSelectedVersion(null)}>
                    ×
                  </ActionButton>
                </div>
              </ModalHeader>
              
              <div style={{ padding: '1.5rem', overflow: 'auto' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  By {selectedVersion.author} • {selectedVersion.timestamp.format('MMM D, YYYY [at] h:mm A')}
                </div>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '1rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Monaco, monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6
                }}>
                  {selectedVersion.content}
                </div>
              </div>
            </ModalContent>
          </CompareModal>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {compareMode && compareVersions.length === 2 && (
          <CompareModal onClick={clearCompare}>
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ModalHeader>
                <h3 style={{ margin: 0 }}>
                  Compare v{compareVersions[0].version} 
                  <FiArrowRight style={{ margin: '0 0.5rem' }} />
                  v{compareVersions[1].version}
                </h3>
                <ActionButton onClick={clearCompare}>×</ActionButton>
              </ModalHeader>
              
              <CompareView>
                <ComparePane isLeft>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Version {compareVersions[0].version}</h4>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '1rem',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Monaco, monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    height: '100%',
                    overflow: 'auto'
                  }}>
                    {compareVersions[0].content}
                  </div>
                </ComparePane>
                
                <ComparePane>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Version {compareVersions[1].version}</h4>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '1rem',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Monaco, monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    height: '100%',
                    overflow: 'auto'
                  }}>
                    {compareVersions[1].content}
                  </div>
                </ComparePane>
              </CompareView>
            </ModalContent>
          </CompareModal>
        )}
      </AnimatePresence>
    </VersionContainer>
  );
}

export default VersionHistory;