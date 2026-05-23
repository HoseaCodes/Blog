import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiSend, FiClock, FiUsers, FiCheckCircle, FiX, FiCalendar,
  FiGlobe, FiLinkedin, FiGithub, FiEdit3, FiEye, FiSettings,
  FiAlertCircle, FiArrowRight, FiPlay, FiPause, FiRefreshCw
} from "react-icons/fi";
import moment from "moment";

const WorkflowContainer = styled.div`
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  overflow-y: auto;
  height: 100%;
`;

const StatusCard = styled.div`
  background: linear-gradient(135deg, ${props => {
    switch (props.status) {
      case 'draft': return '#6b7280, #4b5563';
      case 'review': return '#3b82f6, #2563eb';
      case 'approved': return '#10b981, #059669';
      case 'scheduled': return '#8b5cf6, #7c3aed';
      case 'published': return '#06b6d4, #0891b2';
      default: return '#6b7280, #4b5563';
    }
  }});
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const StatusTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatusDescription = styled.p`
  margin: 0 0 1rem 0;
  opacity: 0.9;
`;

const StatusActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const PlatformCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const PlatformHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PlatformInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PlatformIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const PlatformName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const PlatformStatus = styled.div`
  font-size: 0.75rem;
  color: ${props => {
    switch (props.status) {
      case 'connected': return '#10b981';
      case 'published': return '#06b6d4';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  font-weight: 500;
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

const ScheduleCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const DateInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  margin-right: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ApprovalFlow = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
`;

const ApprovalStep = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StepIndicator = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#10b981';
      case 'current': return '#667eea';
      case 'pending': return '#6b7280';
      default: return '#374151';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const StepDescription = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
`;

const StepAction = styled.div`
  margin-left: 1rem;
`;

function PublishingWorkflow({ article, updateArticle, onPublish, onSchedule, blogAPI }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: false,
    medium: false,
    devto: false,
    ghost: false
  });
  
  // Using blogAPI and handlers from parent:
  // onPublish() - triggers publish workflow
  // onSchedule(date) - schedules article
  // blogAPI.publishArticle(), blogAPI.scheduleArticle()
  
  const [scheduleDate, setScheduleDate] = useState(
    moment().add(1, 'day').format('YYYY-MM-DDTHH:mm')
  );
  
  const [approvalStep, setApprovalStep] = useState(0);

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FiLinkedin,
      color: '#0077b5',
      status: 'connected',
      description: 'Professional networking platform'
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: FiEdit3,
      color: '#00ab6c',
      status: 'connected',
      description: 'Publishing platform for writers'
    },
    {
      id: 'devto',
      name: 'Dev.to',
      icon: FiGithub,
      color: '#0a0a0a',
      status: 'connected',
      description: 'Community for developers'
    },
    {
      id: 'ghost',
      name: 'Ghost',
      icon: FiGlobe,
      color: '#15171a',
      status: 'disconnected',
      description: 'Professional publishing'
    }
  ];

  const approvalSteps = [
    {
      title: 'Content Review',
      description: 'Initial content review and editing',
      status: approvalStep > 0 ? 'completed' : 'current',
      assignee: 'Content Editor'
    },
    {
      title: 'Technical Review',
      description: 'Technical accuracy and code review',
      status: approvalStep > 1 ? 'completed' : approvalStep === 1 ? 'current' : 'pending',
      assignee: 'Senior Engineer'
    },
    {
      title: 'Final Approval',
      description: 'Final approval for publication',
      status: approvalStep > 2 ? 'completed' : approvalStep === 2 ? 'current' : 'pending',
      assignee: 'Publication Manager'
    }
  ];

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const publishArticle = async () => {
    try {
      // Store selected platforms before publishing
      updateArticle({ 
        publishing: {
          ...article.publishing,
          platforms: Object.keys(selectedPlatforms).reduce((acc, key) => {
            acc[key] = { 
              enabled: selectedPlatforms[key], 
              content: "", 
              published: false 
            };
            return acc;
          }, {})
        }
      });
      
      // Use real onPublish handler from parent
      if (onPublish) {
        await onPublish();
      } else {
        // Fallback to local state update
        updateArticle({ status: 'published', publishedAt: moment() });
      }
    } catch (error) {
      console.error('Publishing failed:', error);
    }
  };

  const scheduleArticle = async () => {
    try {
      // Use real onSchedule handler from parent
      if (onSchedule) {
        await onSchedule(scheduleDate);
      } else {
        // Fallback to local state update
        updateArticle({ 
          status: 'scheduled',
          scheduledAt: moment(scheduleDate)
        });
      }
    } catch (error) {
      console.error('Scheduling failed:', error);
    }
  };

  const submitForReview = () => {
    updateArticle({ status: 'review' });
    setApprovalStep(1);
  };

  const approveStep = () => {
    if (approvalStep < approvalSteps.length - 1) {
      setApprovalStep(approvalStep + 1);
    } else {
      updateArticle({ status: 'approved' });
    }
  };

  const getStatusInfo = () => {
    switch (article.status) {
      case 'draft':
        return {
          title: 'Draft Status',
          description: 'Your article is saved as a draft. You can continue editing or submit for review.',
          actions: [
            { label: 'Submit for Review', icon: FiSend, action: submitForReview, primary: true },
            { label: 'Schedule', icon: FiClock, action: scheduleArticle },
            { label: 'Preview', icon: FiEye, action: () => {} }
          ]
        };
      case 'review':
        return {
          title: 'Under Review',
          description: 'Your article is currently being reviewed by the content team.',
          actions: [
            { label: 'View Comments', icon: FiEdit3, action: () => {} }
          ]
        };
      case 'approved':
        return {
          title: 'Approved for Publishing',
          description: 'Your article has been approved and is ready to publish.',
          actions: [
            { label: 'Publish Now', icon: FiSend, action: publishArticle, primary: true },
            { label: 'Schedule', icon: FiClock, action: scheduleArticle }
          ]
        };
      case 'scheduled':
        return {
          title: 'Scheduled for Publishing',
          description: `Your article is scheduled to publish on ${moment(article.scheduledAt).format('MMM D, YYYY [at] h:mm A')}.`,
          actions: [
            { label: 'Publish Now', icon: FiPlay, action: publishArticle, primary: true },
            { label: 'Edit Schedule', icon: FiCalendar, action: () => {} }
          ]
        };
      case 'published':
        return {
          title: 'Published Successfully',
          description: 'Your article has been published across selected platforms.',
          actions: [
            { label: 'View Analytics', icon: FiRefreshCw, action: () => {} },
            { label: 'Update Content', icon: FiEdit3, action: () => {} }
          ]
        };
      default:
        return {
          title: 'Unknown Status',
          description: 'Article status is unknown.',
          actions: []
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <WorkflowContainer>
      {/* Status Overview */}
      <StatusCard status={article.status}>
        <StatusTitle>{statusInfo.title}</StatusTitle>
        <StatusDescription>{statusInfo.description}</StatusDescription>
        <StatusActions>
          {statusInfo.actions.map((action, index) => (
            <ActionButton
              key={index}
              primary={action.primary}
              onClick={action.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <action.icon size={16} />
              {action.label}
            </ActionButton>
          ))}
        </StatusActions>
      </StatusCard>

      {/* Approval Workflow */}
      {(article.status === 'review' || article.status === 'approved') && (
        <Section>
          <SectionTitle>
            <FiUsers />
            Approval Workflow
          </SectionTitle>
          
          <ApprovalFlow>
            {approvalSteps.map((step, index) => (
              <ApprovalStep key={index}>
                <StepIndicator status={step.status}>
                  {step.status === 'completed' ? <FiCheckCircle size={16} /> : index + 1}
                </StepIndicator>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>
                    {step.description} • Assigned to {step.assignee}
                  </StepDescription>
                </StepContent>
                <StepAction>
                  {step.status === 'current' && (
                    <ActionButton
                      onClick={approveStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiCheckCircle size={14} />
                      Approve
                    </ActionButton>
                  )}
                </StepAction>
              </ApprovalStep>
            ))}
          </ApprovalFlow>
        </Section>
      )}

      {/* Publishing Platforms */}
      <Section>
        <SectionTitle>
          <FiGlobe />
          Publishing Platforms
        </SectionTitle>
        
        <PlatformGrid>
          {platforms.map(platform => (
            <PlatformCard key={platform.id}>
              <PlatformHeader>
                <PlatformInfo>
                  <PlatformIcon color={platform.color}>
                    <platform.icon size={20} />
                  </PlatformIcon>
                  <div>
                    <PlatformName>{platform.name}</PlatformName>
                    <PlatformStatus status={platform.status}>
                      {platform.status === 'connected' ? 'Connected' : 'Not Connected'}
                    </PlatformStatus>
                  </div>
                </PlatformInfo>
                
                <Toggle checked={selectedPlatforms[platform.id]}>
                  <input
                    type="checkbox"
                    checked={selectedPlatforms[platform.id]}
                    onChange={() => togglePlatform(platform.id)}
                  />
                  <span></span>
                </Toggle>
              </PlatformHeader>
              
              <p style={{ 
                fontSize: '0.875rem', 
                opacity: 0.8, 
                margin: 0,
                lineHeight: 1.4 
              }}>
                {platform.description}
              </p>
              
              {selectedPlatforms[platform.id] && platform.status === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1rem' }}
                >
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <FiCheckCircle />
                    Ready to publish
                  </div>
                </motion.div>
              )}
            </PlatformCard>
          ))}
        </PlatformGrid>
      </Section>

      {/* Scheduling */}
      <Section>
        <SectionTitle>
          <FiClock />
          Scheduling
        </SectionTitle>
        
        <ScheduleCard>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
              Schedule Publication
            </h4>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>
              Choose when to automatically publish your article
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <DateInput
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
            
            <ActionButton
              onClick={scheduleArticle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiCalendar size={16} />
              Schedule
            </ActionButton>
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.75rem', 
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiAlertCircle />
            Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </div>
        </ScheduleCard>
      </Section>

      {/* Publishing Summary */}
      {Object.values(selectedPlatforms).some(Boolean) && (
        <Section>
          <SectionTitle>
            <FiCheckCircle />
            Publishing Summary
          </SectionTitle>
          
          <div style={{ 
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Selected Platforms:</strong>
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              {Object.entries(selectedPlatforms)
                .filter(([_, enabled]) => enabled)
                .map(([platform]) => platforms.find(p => p.id === platform)?.name)
                .join(', ')}
            </div>
            
            {article.scheduledAt && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                <strong>Scheduled for:</strong> {moment(article.scheduledAt).format('MMM D, YYYY [at] h:mm A')}
              </div>
            )}
          </div>
        </Section>
      )}
    </WorkflowContainer>
  );
}

export default PublishingWorkflow;