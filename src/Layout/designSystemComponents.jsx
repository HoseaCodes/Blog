/**
 * Design System - Component Patterns & Usage Guide
 * 
 * This file demonstrates how to use the design system tokens
 * when creating and styling components.
 */

import styled, { css } from 'styled-components';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  mediaQueries,
  buttonStyles,
  formStyles,
  cardStyles,
} from '../Constants/designTokens';

// ============================================================================
// EXAMPLE: Button Component using Design Tokens
// ============================================================================

export const Button = styled.button`
  /* Base styles */
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSizes.body};
  font-weight: ${typography.fontWeights.bold};
  border-radius: ${borderRadius.pill};
  border: 2px solid ${colors.primary.green};
  background: ${colors.primary.green};
  color: ${colors.primary.white};
  cursor: pointer;
  transition: ${transitions.property.all};

  /* Hover state */
  &:hover {
    background: ${colors.primary.greenDark};
    border-color: ${colors.primary.greenDark};
  }

  /* Focus state (accessibility) */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary.gold};
  }

  /* Disabled state */
  &:disabled {
    background: ${colors.secondary.grayLight};
    border-color: ${colors.secondary.grayLight};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Responsive */
  ${mediaQueries.mobile} {
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.fontSizes.label};
  }
`;

// ============================================================================
// EXAMPLE: Card Component using Design Tokens
// ============================================================================

export const Card = styled.div`
  background: ${colors.primary.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.md};
  padding: ${spacing.lg};
  transition: ${transitions.property.all};

  &:hover {
    box-shadow: ${shadows.lg};
  }

  ${mediaQueries.mobile} {
    padding: ${spacing.md};
  }
`;

// ============================================================================
// EXAMPLE: Text Components using Design Tokens
// ============================================================================

export const Heading1 = styled.h1`
  font-size: ${typography.fontSizes.h1};
  font-weight: ${typography.fontWeights.bold};
  line-height: ${typography.lineHeights.tight};
  margin: 0;
  color: ${colors.secondary.grayDark};
  text-transform: capitalize;

  ${mediaQueries.mobile} {
    font-size: ${typography.fontSizes.h3};
  }
`;

export const Heading2 = styled.h2`
  font-size: ${typography.fontSizes.h2};
  font-weight: ${typography.fontWeights.bold};
  line-height: ${typography.lineHeights.tight};
  margin: ${spacing.lg} 0 ${spacing.md} 0;
  color: ${colors.secondary.grayDark};
  text-transform: capitalize;

  ${mediaQueries.mobile} {
    font-size: ${typography.fontSizes.h4};
    margin: ${spacing.md} 0 ${spacing.sm} 0;
  }
`;

export const Heading3 = styled.h3`
  font-size: ${typography.fontSizes.h3};
  font-weight: ${typography.fontWeights.semibold};
  line-height: ${typography.lineHeights.normal};
  margin: ${spacing.md} 0;
  color: ${colors.secondary.grayDark};
`;

export const BodyText = styled.p`
  font-size: ${typography.fontSizes.body};
  font-weight: ${typography.fontWeights.regular};
  line-height: ${typography.lineHeights.relaxed};
  margin: ${spacing.md} 0;
  color: ${colors.secondary.grayDark};

  ${mediaQueries.mobile} {
    font-size: ${typography.fontSizes.label};
  }
`;

export const SecondaryText = styled.p`
  font-size: ${typography.fontSizes.label};
  font-weight: ${typography.fontWeights.regular};
  line-height: ${typography.lineHeights.normal};
  margin: ${spacing.sm} 0;
  color: ${colors.secondary.gray};
`;

export const Caption = styled.span`
  font-size: ${typography.fontSizes.caption};
  font-weight: ${typography.fontWeights.regular};
  color: ${colors.secondary.gray};
  line-height: ${typography.lineHeights.normal};
`;

// ============================================================================
// EXAMPLE: Form Component using Design Tokens
// ============================================================================

export const FormInput = styled.input`
  width: 100%;
  padding: ${spacing.md};
  font-size: ${typography.fontSizes.body};
  border: 2px solid ${colors.secondary.grayLight};
  border-radius: ${borderRadius.md};
  transition: ${transitions.property.border};

  &:focus {
    outline: none;
    border-color: ${colors.primary.green};
    box-shadow: 0 0 0 3px rgba(32, 71, 64, 0.1);
  }

  &::placeholder {
    color: ${colors.secondary.gray};
  }

  &:disabled {
    background-color: ${colors.secondary.grayLight};
    cursor: not-allowed;
  }
`;

export const FormLabel = styled.label`
  display: block;
  font-size: ${typography.fontSizes.label};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.secondary.grayDark};
  margin-bottom: ${spacing.sm};
`;

// ============================================================================
// EXAMPLE: Layout Container using Design Tokens
// ============================================================================

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.xl};

  ${mediaQueries.tablet} {
    padding: ${spacing.lg};
  }

  ${mediaQueries.mobile} {
    padding: ${spacing.md};
  }
`;

export const SectionContainer = styled.section`
  padding: ${spacing.xxl} 0;
  background: ${props => props.background || colors.primary.white};

  ${mediaQueries.mobile} {
    padding: ${spacing.lg} 0;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  gap: ${props => props.gap || spacing.lg};
  flex-wrap: wrap;
  align-items: ${props => props.align || 'flex-start'};
  justify-content: ${props => props.justify || 'flex-start'};

  ${mediaQueries.mobile} {
    flex-direction: ${props => props.mobileDirection || 'column'};
    gap: ${spacing.md};
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: ${props => props.gap || spacing.lg};

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing.md};
  }

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${spacing.md};
  }
`;

// ============================================================================
// BEST PRACTICES EXAMPLES
// ============================================================================

/**
 * BEST PRACTICE: Use Design Tokens Consistently
 * 
 * ✅ GOOD - Using design tokens
 */
export const GoodCard = styled.div`
  padding: ${spacing.lg};
  background: ${colors.primary.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.md};
  margin-bottom: ${spacing.md};
`;

/**
 * ❌ BAD - Hard-coded values without tokens
 */
export const BadCard = styled.div`
  padding: 32px;  /* Should use spacing.lg */
  background: white;  /* Should use colors.primary.white */
  border-radius: 8px;  /* Should use borderRadius.md */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);  /* Should use shadows.md */
  margin-bottom: 16px;  /* Should use spacing.md */
`;

/**
 * BEST PRACTICE: Build with Responsive Design in Mind
 * 
 * ✅ GOOD - Responsive layout
 */
export const ResponsiveLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
  padding: ${spacing.xl};

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
    padding: ${spacing.lg};
  }

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    padding: ${spacing.md};
  }
`;

/**
 * ❌ BAD - Not responsive
 */
export const NonResponsiveLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 64px;
  /* No responsive breakpoints */
`;

/**
 * BEST PRACTICE: Ensure Accessibility with Focus States
 * 
 * ✅ GOOD - Includes focus state
 */
export const AccessibleButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  background: ${colors.primary.green};
  color: ${colors.primary.white};
  border: none;
  border-radius: ${borderRadius.pill};
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary.gold};
  }
`;

/**
 * ❌ BAD - Missing focus state
 */
export const InaccessibleButton = styled.button`
  padding: 16px 32px;
  background: #204740;
  color: white;
  border: none;
  cursor: pointer;
  /* No focus state for keyboard navigation */
`;

// ============================================================================
// COMPOSITION: Building Complex Components
// ============================================================================

/**
 * Example: Blog Card Component composed from multiple styled elements
 */
export const BlogCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

export const BlogCardImage = styled.img`
  width: 100%;
  aspect-ratio: ${16}/${9};
  object-fit: cover;
  border-radius: ${borderRadius.md} ${borderRadius.md} 0 0;
  margin: calc(-${spacing.lg}) calc(-${spacing.lg}) ${spacing.lg} calc(-${spacing.lg});
`;

export const BlogCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const BlogCardMeta = styled.div`
  display: flex;
  gap: ${spacing.md};
  font-size: ${typography.fontSizes.caption};
  color: ${colors.secondary.gray};
`;

// ============================================================================
// USAGE IN REACT COMPONENTS
// ============================================================================

/**
 * Example React Component using Design System
 * 
 * import { Heading2, BodyText, Button, Container } from './styledComponents';
 * 
 * function MyComponent() {
 *   return (
 *     <Container>
 *       <Heading2>Welcome to My Site</Heading2>
 *       <BodyText>This text uses the design system tokens.</BodyText>
 *       <Button>Click Me</Button>
 *     </Container>
 *   );
 * }
 */

export default {
  Button,
  Card,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  SecondaryText,
  Caption,
  FormInput,
  FormLabel,
  Container,
  SectionContainer,
  FlexContainer,
  GridContainer,
};
