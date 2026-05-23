import React from 'react'
import styled from 'styled-components'  
import { motion } from 'framer-motion';

export default function MinimalResumeCTA() {
  const CareerMinimalBanner = styled.section`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f8ff 100%);
  padding: 4rem 2rem;
  text-align: center;
`;

const CareerMinimalContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CareerMinimalBadge = styled.div`
  display: inline-block;
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(33, 150, 243, 0.2);
`;

const CareerMinimalTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  .blue {
    color: #2196F3;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CareerMinimalSubtext = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CareerMinimalButton = styled(motion.button)`
  background: #2196F3;
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
  }
`;
  return (
    <CareerMinimalBanner>
        <CareerMinimalContainer>
          <CareerMinimalBadge>
            ⭐ THE BEST RESUME BUILDER ONLINE
          </CareerMinimalBadge>
          <CareerMinimalTitle>
            Make Your Professional <span className="blue">Resume</span><br />
            in Minutes
          </CareerMinimalTitle>
          <CareerMinimalSubtext>
            Try our resume builder and create a resume with the power of AI. 
            Let the Genius resume maker help build your resume quickly and effortlessly.
          </CareerMinimalSubtext>
          <CareerMinimalButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://www.careercompose.com/', '_blank')}
          >
            Create Resume
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </CareerMinimalButton>
        </CareerMinimalContainer>
      </CareerMinimalBanner>
  )
}
