import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BannerContainer = styled.div`
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  padding: 3rem 2rem;
`;

const BannerContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
`;

const BannerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem;
  }
`;

const BannerLeft = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BannerLogo = styled.img`
  height: 5rem;
  object-fit: contain;
`;

const BannerTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin: 0;

  .highlight {
    background: transparent !important;
    color: #ef4444;
  }

  @media (max-width: 768px) {
    font-size: 1.875rem;
  }
`;

const BannerRight = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const BannerImage = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const BannerButton = styled(motion.button)`
  background: #ef4444;
  color: white;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

function CaseStudyBanner({
  logo,
  title,
  highlightText,
  image,
  buttonText = "Follow the journey",
  onButtonClick
}) {
  return (
    <BannerContainer>
      <BannerContent>
        <BannerGrid>
          <BannerLeft
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {logo && <BannerLogo src={logo} alt="Company Logo" />}
            <BannerTitle>
              {title}
              {highlightText && <span className="highlight">{highlightText}</span>}
            </BannerTitle>
          </BannerLeft>

          <BannerRight
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {image && <BannerImage src={image} alt="Case Study Visual" />}
            {buttonText && (
              <BannerButton
                onClick={onButtonClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {buttonText}
              </BannerButton>
            )}
          </BannerRight>
        </BannerGrid>
      </BannerContent>
    </BannerContainer>
  );
}

export default CaseStudyBanner;
