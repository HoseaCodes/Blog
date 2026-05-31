import React, { useCallback, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import axios from "axios";
import {
  FiSend, FiClock, FiUsers, FiCheckCircle, FiX, FiCalendar,
  FiGlobe, FiLinkedin, FiGithub, FiEdit3, FiEye, FiSettings,
  FiAlertCircle, FiArrowRight, FiPlay, FiPause, FiRefreshCw
} from "react-icons/fi";
import moment from "moment";
import { GlobalState } from "../../GlobalState";

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
      case 'draft': return '#a3acb2, #4b5563';
      case 'review': return '#5bb39e, #2563eb';
      case 'approved': return '#5bb39e, #059669';
      case 'scheduled': return '#5bb39e, #7c3aed';
      case 'published': return '#06b6d4, #0891b2';
      default: return '#a3acb2, #4b5563';
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
  color: #5bb39e;
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
    border-color: #5bb39e;
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
      case 'connected': return '#5bb39e';
      case 'published': return '#06b6d4';
      case 'error': return '#ef4444';
      default: return '#a3acb2';
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
    background-color: ${props => props.checked ? '#5bb39e' : '#374151'};
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
    border-color: #5bb39e;
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
      case 'completed': return '#5bb39e';
      case 'current': return '#5bb39e';
      case 'pending': return '#a3acb2';
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

function PublishingWorkflow({
  article,
  updateArticle,
  onPublish,
  onSchedule,
  onPostToLinkedIn,
  mongoId,
  blogAPI,
}) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;
  const [linkedinPosting, setLinkedinPosting] = useState(false);
  const [linkedinGenerating, setLinkedinGenerating] = useState(false);
  // When the article has been posted, the intro section collapses. User can
  // override (e.g. to re-post with a new intro) by clicking the re-post link.
  const [forceShowLinkedinIntro, setForceShowLinkedinIntro] = useState(false);

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: false,
    medium: false,
    devto: false,
    ghost: false
  });

  const [linkedinStatus, setLinkedinStatus] = useState({ loading: true, connected: false });
  const [linkedinIntro, setLinkedinIntro] = useState(
    article?.publishing?.linkedinIntro || ''
  );

  const [scheduleDate, setScheduleDate] = useState(
    moment().add(1, 'day').format('YYYY-MM-DDTHH:mm')
  );

  const [approvalStep, setApprovalStep] = useState(0);

  // Fetch real LinkedIn connection state. Only admins can connect/post.
  const fetchLinkedInStatus = useCallback(async () => {
    if (!isAdmin || !token) {
      setLinkedinStatus({ loading: false, connected: false });
      return;
    }
    try {
      const res = await axios.get('/api/admin/linkedin/status', {
        headers: { Authorization: token },
      });
      setLinkedinStatus({ loading: false, ...res.data });
    } catch (err) {
      console.error('LinkedIn status fetch failed:', err);
      setLinkedinStatus({ loading: false, connected: false });
    }
  }, [isAdmin, token]);

  useEffect(() => { fetchLinkedInStatus(); }, [fetchLinkedInStatus]);

  // Once we know LinkedIn is connected, auto-enable its toggle so the user
  // doesn't have to flip it manually every time they open the workflow.
  // They opted in by connecting; this just stops the "looks off" confusion.
  useEffect(() => {
    if (linkedinStatus.connected) {
      setSelectedPlatforms(prev => (prev.linkedin ? prev : { ...prev, linkedin: true }));
    }
  }, [linkedinStatus.connected]);

  // After every successful post, recollapse the intro section. linkedinPostedAt
  // changes both on first post AND on each re-post (new timestamp), so the
  // intro hides itself again every time without sticky-expanded state.
  useEffect(() => {
    if (article?.linkedinPostedAt) {
      setForceShowLinkedinIntro(false);
    }
  }, [article?.linkedinPostedAt]);

  // Detect post-OAuth redirect (?linkedin=connected or =error). Refetch status,
  // strip the query params so refreshes don't re-trigger the side-effect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const liResult = params.get('linkedin');
    if (!liResult) return;

    if (liResult === 'connected') fetchLinkedInStatus();
    if (liResult === 'error') {
      const reason = params.get('reason') || 'unknown';
      console.error(`LinkedIn connect failed: ${reason}`);
    }

    params.delete('linkedin');
    params.delete('reason');
    const qs = params.toString();
    const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }, [fetchLinkedInStatus]);

  const handleConnectLinkedIn = async () => {
    // XHR with auth header (browser navigation can't carry Authorization).
    // Backend sets the state cookie on this response, then returns the LinkedIn
    // authorize URL. Then we navigate the browser there.
    const returnTo = window.location.pathname + window.location.search;
    try {
      const res = await axios.get('/api/admin/linkedin/connect', {
        params: { returnTo },
        headers: { Authorization: token },
      });
      if (res.data?.authUrl) {
        window.location.href = res.data.authUrl;
      } else {
        alert('LinkedIn connect failed: no auth URL returned.');
      }
    } catch (err) {
      alert('Failed to start LinkedIn connect: ' + (err.response?.data?.msg || err.message));
    }
  };

  const SITE_URL = 'https://hoseacodes.com';

  const handleGenerateLinkedInIntro = async () => {
    if (linkedinGenerating) return;
    const content = article?.content || article?.markdown;
    if (!content || content.trim().length < 50) {
      alert('Add some article content first — the generator needs something to summarize.');
      return;
    }
    if (linkedinIntro && !window.confirm('Replace the current intro with a generated one?')) {
      return;
    }
    setLinkedinGenerating(true);
    try {
      const res = await axios.post(
        '/api/ai/social-posts',
        { content, platforms: ['linkedin'] },
        { headers: { Authorization: token } }
      );
      const generated = res.data?.posts?.linkedin?.trim();
      if (!generated) {
        alert('Generation returned empty — try again or write the intro manually.');
        return;
      }
      const slug = article?.slug;
      const url = slug ? `${SITE_URL}/blog/${slug}` : null;
      const withLink = url ? `${generated}\n\nRead the full article: ${url}` : generated;
      setLinkedinIntro(withLink);
    } catch (err) {
      alert('Failed to generate intro: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLinkedinGenerating(false);
    }
  };

  const handlePostToLinkedInClick = async () => {
    if (!onPostToLinkedIn || linkedinPosting) return;
    setLinkedinPosting(true);
    try {
      await onPostToLinkedIn(linkedinIntro || null);
    } finally {
      setLinkedinPosting(false);
    }
  };

  const handleDisconnectLinkedIn = async () => {
    if (!window.confirm("Disconnect LinkedIn? You'll need to reconnect to cross-post.")) return;
    try {
      await axios.delete('/api/admin/linkedin/disconnect', {
        headers: { Authorization: token },
      });
      setLinkedinStatus({ loading: false, connected: false });
    } catch (err) {
      alert('Failed to disconnect: ' + (err.response?.data?.msg || err.message));
    }
  };

  // Real per-platform status: LinkedIn pulled from API; others remain TODO.
  const platforms = [
    ...(isAdmin ? [{
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FiLinkedin,
      color: '#0077b5',
      status: linkedinStatus.connected ? 'connected' : 'disconnected',
      description: linkedinStatus.connected
        ? `Connected as ${linkedinStatus.displayName || 'you'}`
        : 'Professional networking platform'
    }] : []),
    {
      id: 'medium',
      name: 'Medium',
      icon: FiEdit3,
      color: '#00ab6c',
      status: 'disconnected',
      description: 'Publishing platform for writers (not wired)'
    },
    {
      id: 'devto',
      name: 'Dev.to',
      icon: FiGithub,
      color: '#0a0a0a',
      status: 'disconnected',
      description: 'Community for developers (not wired)'
    },
    {
      id: 'ghost',
      name: 'Ghost',
      icon: FiGlobe,
      color: '#15171a',
      status: 'disconnected',
      description: 'Professional publishing (not wired)'
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
      const platforms = Object.keys(selectedPlatforms).reduce((acc, key) => {
        acc[key] = {
          enabled: selectedPlatforms[key],
          content: "",
          published: false
        };
        return acc;
      }, {});

      // Pass the freshly-snapshotted publish options directly to onPublish.
      // updateArticle is async (state batches) so handlePublish would otherwise
      // read stale article.publishing here and skip the LinkedIn cross-post.
      const publishOpts = {
        platforms,
        linkedinIntro: linkedinIntro || null,
      };

      // Still mirror into article state for any consumers reading article.publishing.
      updateArticle({
        publishing: {
          ...article.publishing,
          ...publishOpts,
        }
      });

      if (onPublish) {
        await onPublish(publishOpts);
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
          title: 'Ready to publish',
          description: 'Your article is saved as a draft. Publish now to make it live, or schedule it for later.',
          actions: [
            { label: 'Publish Now', icon: FiSend, action: publishArticle, primary: true },
            { label: 'Schedule', icon: FiClock, action: scheduleArticle },
            { label: 'Submit for Review', icon: FiEdit3, action: submitForReview }
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

              {/* Persistent "posted" indicator — visible regardless of toggle state */}
              {platform.id === 'linkedin' && platform.status === 'connected' && article?.linkedinPostedAt && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.375rem 0.625rem',
                  background: 'rgba(91, 179, 158, 0.1)',
                  border: '1px solid rgba(91, 179, 158, 0.25)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#5bb39e',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}>
                  <FiCheckCircle />
                  Posted to LinkedIn {moment(article.linkedinPostedAt).fromNow()}
                </div>
              )}

              {selectedPlatforms[platform.id] && platform.status === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1rem' }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#5bb39e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <FiCheckCircle />
                    Ready to publish
                  </div>

                  {platform.id === 'linkedin' &&
                    (!article?.linkedinPostedAt || forceShowLinkedinIntro) && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <label style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          LinkedIn intro (optional)
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateLinkedInIntro}
                          disabled={linkedinGenerating}
                          style={{
                            background: 'rgba(91, 179, 158, 0.15)',
                            border: '1px solid rgba(91, 179, 158, 0.3)',
                            color: '#5bb39e',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            cursor: linkedinGenerating ? 'not-allowed' : 'pointer'
                          }}
                          title="Generate a LinkedIn intro from this article using AI"
                        >
                          {linkedinGenerating ? 'Generating…' : '✨ Generate from article'}
                        </button>
                      </div>
                      <textarea
                        value={linkedinIntro}
                        onChange={(e) => setLinkedinIntro(e.target.value)}
                        placeholder="Custom intro for your LinkedIn post. Leave blank for the default title + description + URL, or click 'Generate from article' for an AI-written intro."
                        rows={4}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '0.5rem',
                          fontSize: '0.8125rem',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={handlePostToLinkedInClick}
                          disabled={!mongoId || linkedinPosting || article?.draft}
                          title={
                            !mongoId
                              ? 'Save the article first'
                              : article?.draft
                              ? 'Publish the article first'
                              : 'Post this article to LinkedIn now'
                          }
                          style={{
                            background: !mongoId || article?.draft ? '#374151' : '#0077b5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 0.875rem',
                            fontSize: '0.8125rem',
                            cursor: !mongoId || linkedinPosting || article?.draft ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            opacity: !mongoId || article?.draft ? 0.6 : 1
                          }}
                        >
                          <FiLinkedin />
                          {linkedinPosting ? 'Posting…' : 'Post to LinkedIn now'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Re-post escape hatch — only when collapsed (i.e. already posted) */}
                  {platform.id === 'linkedin' &&
                    article?.linkedinPostedAt &&
                    !forceShowLinkedinIntro && (
                    <button
                      type="button"
                      onClick={() => setForceShowLinkedinIntro(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a3acb2',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: '0.5rem 0 0',
                        display: 'block'
                      }}
                    >
                      Re-post anyway
                    </button>
                  )}

                  {platform.id === 'linkedin' && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={handleDisconnectLinkedIn}
                        style={{
                          marginTop: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: '#a3acb2',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Disconnect LinkedIn
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {selectedPlatforms[platform.id] &&
                platform.status === 'disconnected' &&
                platform.id === 'linkedin' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1rem' }}
                >
                  <button
                    type="button"
                    onClick={handleConnectLinkedIn}
                    disabled={linkedinStatus.loading}
                    style={{
                      background: '#0077b5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 0.875rem',
                      fontSize: '0.8125rem',
                      cursor: linkedinStatus.loading ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}
                  >
                    <FiLinkedin />
                    {linkedinStatus.loading ? 'Checking…' : 'Connect LinkedIn'}
                  </button>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: '0.5rem 0 0' }}>
                    Authorize once. We'll cross-post when you click Publish.
                  </p>
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