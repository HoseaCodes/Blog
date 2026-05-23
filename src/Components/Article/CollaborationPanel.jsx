import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiUsers, FiMessageSquare, FiShare2, FiUserPlus, FiEdit3,
  FiEye, FiCheckCircle, FiClock, FiAlertTriangle, FiX, FiSend
} from "react-icons/fi";
import moment from "moment";

const CollaborationContainer = styled.div`
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  overflow-y: auto;
  height: 100%;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
`;

const CollaboratorCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CollaboratorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const CollaboratorDetails = styled.div``;

const Name = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Role = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const Permission = styled.div`
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CommentThread = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const CommentTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const CommentContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

const AddCommentForm = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CommentInput = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 0.75rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 0.75rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ShareSettings = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
`;

const ShareOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.checked ? '#667eea' : '#374151'};
    transition: 0.4s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: ${props => props.checked ? '23px' : '3px'};
      bottom: 3px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
`;

const ActivityFeed = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.type === 'comment' ? 'rgba(59, 130, 246, 0.3)' : 
                        props.type === 'edit' ? 'rgba(16, 185, 129, 0.3)' :
                        'rgba(139, 92, 246, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.type === 'comment' ? '#3b82f6' : 
                    props.type === 'edit' ? '#10b981' :
                    '#8b5cf6'};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

function CollaborationPanel({ article, updateArticle, collaborationAPI }) {
  const [newComment, setNewComment] = useState('');
  const [shareSettings, setShareSettings] = useState({
    allowComments: true,
    allowEdits: false,
    publicView: false
  });
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real collaboration data
  useEffect(() => {
    if (collaborationAPI && article?.id) {
      fetchCollaborationData();
    }
  }, [article?.id, collaborationAPI]);

  const fetchCollaborationData = async () => {
    setLoading(true);
    try {
      // Fetch collaborators
      const collabResponse = await collaborationAPI.getCollaborators(article.id);
      setCollaborators(collabResponse.collaborators || []);

      // Fetch activity feed
      const activityResponse = await collaborationAPI.getActivityFeed(article.id);
      setActivities(activityResponse.activities || []);
      
      // Extract comments from article or activity
      setComments(article.collaboration?.comments || []);
    } catch (error) {
      console.error('Failed to fetch collaboration data:', error);
      setCollaborators([]);
      setComments([]);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (newComment.trim() && collaborationAPI) {
      try {
        await collaborationAPI.addInlineComment(article.id, {
          content: newComment,
          timestamp: new Date()
        });
        
        // Add to local state
        const comment = {
          id: Date.now(),
          author: 'Current User',
          content: newComment,
          timestamp: moment(),
          resolved: false
        };
        setComments([comment, ...comments]);
        setNewComment('');
        
        // Refresh activity feed
        await fetchCollaborationData();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const resolveComment = async (commentId) => {
    if (collaborationAPI) {
      try {
        await collaborationAPI.resolveInlineComment(commentId);
        
        // Update local state
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, resolved: true } : c
        ));
        
        // Refresh activity feed
        await fetchCollaborationData();
      } catch (error) {
        console.error('Failed to resolve comment:', error);
      }
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment': return FiMessageSquare;
      case 'edit': return FiEdit3;
      case 'share': return FiShare2;
      default: return FiClock;
    }
  };

  const toggleShareSetting = (setting) => {
    setShareSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleAddCollaborator = async () => {
    // In a real implementation, you'd have a modal to select user and role
    // For now, this is a placeholder
    console.log('Add collaborator modal would open here');
    // Example: await collaborationAPI.addCollaborator(article.id, userId, 'editor');
  };

  if (!collaborationAPI || !article?.id) {
    return (
      <CollaborationContainer>
        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
          <FiUsers size={48} style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Collaboration Unavailable
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Save the article to enable collaboration features
          </div>
        </div>
      </CollaborationContainer>
    );
  }

  return (
    <CollaborationContainer>
      {/* Collaborators */}
      <Section>
        <SectionTitle>
          <FiUsers />
          Collaborators
        </SectionTitle>
        
        {collaborators.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6, fontSize: '0.875rem' }}>
            No collaborators yet. Add collaborators to work together on this article.
          </div>
        ) : (
          collaborators.map(collaborator => (
            <CollaboratorCard key={collaborator.id || collaborator._id}>
              <CollaboratorInfo>
                <Avatar>
                  {collaborator.avatar || 
                   (collaborator.name || collaborator.username || 'U')
                     .split(' ')
                     .map(n => n[0])
                     .join('')
                     .toUpperCase()}
                </Avatar>
                <CollaboratorDetails>
                  <Name>{collaborator.name || collaborator.username || 'Unknown User'}</Name>
                  <Role>{collaborator.role || 'Collaborator'}</Role>
                </CollaboratorDetails>
              </CollaboratorInfo>
              <Permission>{collaborator.permission || collaborator.role || 'View'}</Permission>
            </CollaboratorCard>
          ))
        )}

        <ActionButton
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          onClick={handleAddCollaborator}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiUserPlus size={16} />
          Add Collaborator
        </ActionButton>
      </Section>

      {/* Comments */}
      <Section>
        <SectionTitle>
          <FiMessageSquare />
          Comments ({comments.filter(c => !c.resolved).length} unresolved)
        </SectionTitle>

        <AddCommentForm>
          <CommentInput
            placeholder="Add a comment or suggestion..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <ActionButton
            onClick={addComment}
            disabled={!newComment.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSend size={14} />
            Add Comment
          </ActionButton>
        </AddCommentForm>

        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6, fontSize: '0.875rem' }}>
            No comments yet. Be the first to add a comment or suggestion.
          </div>
        ) : (
          <AnimatePresence>
            {comments.map(comment => (
              <motion.div
                key={comment.id || comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CommentThread>
                  <CommentHeader>
                    <CommentAuthor>
                      <Avatar style={{ width: '24px', height: '24px', fontSize: '0.625rem' }}>
                        {(comment.author || 'U').split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      {comment.author || 'Unknown User'}
                    {comment.resolved && (
                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        RESOLVED
                      </div>
                    )}
                  </CommentAuthor>
                  <CommentTime>
                    {comment.timestamp ? moment(comment.timestamp).fromNow() : 'Just now'}
                  </CommentTime>
                </CommentHeader>
                
                <CommentContent>{comment.content || ''}</CommentContent>
                
                {!comment.resolved && (
                  <CommentActions>
                    <ActionButton
                      onClick={() => resolveComment(comment.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiCheckCircle size={12} />
                      Resolve
                    </ActionButton>
                    <ActionButton>
                      <FiMessageSquare size={12} />
                      Reply
                    </ActionButton>
                  </CommentActions>
                )}
              </CommentThread>
            </motion.div>
          ))}
          </AnimatePresence>
        )}
      </Section>

      {/* Share Settings */}
      <Section>
        <SectionTitle>
          <FiShare2 />
          Sharing Settings
        </SectionTitle>
        
        <ShareSettings>
          <ShareOption>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                Allow Comments
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Let collaborators add comments and suggestions
              </div>
            </div>
            <Toggle checked={shareSettings.allowComments}>
              <input
                type="checkbox"
                checked={shareSettings.allowComments}
                onChange={() => toggleShareSetting('allowComments')}
              />
              <span></span>
            </Toggle>
          </ShareOption>

          <ShareOption>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                Allow Edits
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Let collaborators directly edit content
              </div>
            </div>
            <Toggle checked={shareSettings.allowEdits}>
              <input
                type="checkbox"
                checked={shareSettings.allowEdits}
                onChange={() => toggleShareSetting('allowEdits')}
              />
              <span></span>
            </Toggle>
          </ShareOption>

          <ShareOption>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                Public View
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Anyone with the link can view this article
              </div>
            </div>
            <Toggle checked={shareSettings.publicView}>
              <input
                type="checkbox"
                checked={shareSettings.publicView}
                onChange={() => toggleShareSetting('publicView')}
              />
              <span></span>
            </Toggle>
          </ShareOption>
        </ShareSettings>
      </Section>

      {/* Activity Feed */}
      <Section>
        <SectionTitle>
          <FiClock />
          Recent Activity
        </SectionTitle>
        
        <ActivityFeed>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6, fontSize: '0.875rem' }}>
              No activity yet. Activity will appear as collaborators work on this article.
            </div>
          ) : (
            activities.map(activity => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <ActivityItem key={activity.id || activity._id}>
                  <ActivityIcon type={activity.type}>
                    <IconComponent size={16} />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>
                      <strong>{activity.user || activity.username || 'Someone'}</strong> {activity.action || 'performed an action'}
                    </ActivityText>
                    <ActivityTime>
                      {activity.timestamp ? moment(activity.timestamp).fromNow() : 'Recently'}
                    </ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              );
            })
          )}
        </ActivityFeed>
      </Section>
    </CollaborationContainer>
  );
}

export default CollaborationPanel;