import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion';

export default function ResumeCTA() {
    const CareerFeaturesBanner = styled.section`
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 4rem 2rem;
    position: relative;
    overflow: hidden;
    border-top: 1px solid #e1f5fe;
    border-bottom: 1px solid #e1f5fe;
    `;

    const CareerFeaturesContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 3rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;
    }
    `;

    const CareerFeaturesContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
    `;

    const CareerFeaturesLogo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #1e293b;
    font-weight: 600;
    font-size: 1.1rem;
    
    &::before {
        content: '';
        width: 32px;
        height: 32px;
        background: linear-gradient(45deg, #2196F3, #1976D2);
        border-radius: 8px;
        position: relative;
    }
    `;

    const CareerFeaturesText = styled.h3`
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    
    .highlight {
        color: #2196F3;
    }
    
    @media (max-width: 768px) {
        font-size: 1.6rem;
    }
    `;

    const CareerFeaturesVisual = styled.div`
    position: relative;
    width: 200px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    @media (max-width: 768px) {
        width: 160px;
        height: 100px;
    }
    `;

    const AIIcon = styled.div`
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    border-radius: 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before {
        content: 'AI';
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    &::after {
        content: '';
        position: absolute;
        top: -10px;
        right: -10px;
        width: 24px;
        height: 24px;
        background: #4CAF50;
        border-radius: 50%;
        border: 3px solid white;
    }
    `;

    const CareerFeaturesCTA = styled(motion.button)`
    background: #2196F3;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background: #1976D2;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(33, 150, 243, 0.3);
    }
    `;

  return (
    <CareerFeaturesBanner>
        <CareerFeaturesContainer>
            <CareerFeaturesContent>
            <CareerFeaturesLogo>
                CareerCompose
            </CareerFeaturesLogo>
            <CareerFeaturesText>
                Professionals create<br />
                resumes with <span className="highlight">AI Power</span>
            </CareerFeaturesText>
            </CareerFeaturesContent>
            <CareerFeaturesVisual>
            <AIIcon />
            <CareerFeaturesCTA
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Try AI Resume Builder
            </CareerFeaturesCTA>
            </CareerFeaturesVisual>
        </CareerFeaturesContainer>
    </CareerFeaturesBanner>
  )
}
