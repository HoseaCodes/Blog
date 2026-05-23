import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion';

export default function ResumeBannerCTA() {
    const CareerSubscriptionBanner = styled.section`
    background: linear-gradient(135deg, #f8fafc 0%, #e1f5fe 100%);
    padding: 4rem 2rem;
    position: relative;
    overflow: hidden;
    `;

    const CareerSubscriptionContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 300px 1fr 1fr;
    align-items: center;
    gap: 3rem;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }
    `;

    const CareerLogo = styled.div`
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    font-weight: 700;
    font-size: 1.2rem;
    line-height: 1.2;
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.2);
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
    }
    `;

    const ResumeIllustration = styled.div`
    position: relative;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before {
        content: '';
        position: absolute;
        width: 80px;
        height: 100px;
        background: linear-gradient(45deg, #2196F3, #1976D2);
        border-radius: 8px;
        transform: rotate(-10deg);
        box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
    }
    
    &::after {
        content: '';
        position: absolute;
        width: 60px;
        height: 80px;
        background: linear-gradient(45deg, #64B5F6, #42A5F5);
        border-radius: 8px;
        transform: rotate(15deg) translateX(30px);
        box-shadow: 0 8px 20px rgba(100, 181, 246, 0.3);
    }
    
    /* Document lines effect */
    &::first-letter {
        position: absolute;
        content: '';
        width: 40px;
        height: 2px;
        background: rgba(255, 255, 255, 0.8);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    `;

    const CareerSubscriptionContent = styled.div`
    text-align: left;
    
    @media (max-width: 1024px) {
        text-align: center;
    }
    `;

    const CareerSubscriptionTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    
    .highlight {
        background: linear-gradient(45deg, #2196F3, #1976D2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    @media (max-width: 768px) {
        font-size: 2rem;
    }
    `;

    const CareerSubscriptionSubtext = styled.p`
    color: #64748b;
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 2rem;
    max-width: 400px;
    
    @media (max-width: 1024px) {
        margin: 0 auto 2rem auto;
    }
    `;

    const CareerSubscriptionButton = styled(motion.button)`
    background: linear-gradient(45deg, #2196F3, #1976D2);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
        background: linear-gradient(45deg, #1976D2, #1565C0);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
    }
    
    &::after {
        content: '';
        margin-left: 0.5rem;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 4px 0 4px 6px;
        border-color: transparent transparent transparent white;
    }
    `;
  return (
    <CareerSubscriptionBanner>
        <CareerSubscriptionContainer>
            <CareerLogo>
            CAREER<br />
            COMPOSE<br />
            PRO
            </CareerLogo>
            <ResumeIllustration />
            <CareerSubscriptionContent>
            <CareerSubscriptionTitle>
                Build Your <span className="highlight">Professional</span><br />
                Resume in Minutes
            </CareerSubscriptionTitle>
            <CareerSubscriptionSubtext>
                Join thousands of professionals who've landed their dream jobs with 
                AI-powered resume building and career optimization tools.
            </CareerSubscriptionSubtext>
            <CareerSubscriptionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Create Resume
            </CareerSubscriptionButton>
            </CareerSubscriptionContent>
        </CareerSubscriptionContainer>
    </CareerSubscriptionBanner>
  )
}
