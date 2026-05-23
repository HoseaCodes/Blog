// AdvancedBlocks.jsx
import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FiPlus, FiCode, FiImage, FiType, FiMessageSquare, FiAlertTriangle } from "react-icons/fi";

const BlocksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const BlockButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

function AdvancedBlocks({ article, updateArticle }) {
  const blocks = [
    { icon: FiCode, label: "Code Block", snippet: "\n```javascript\n// Your code here\n```\n" },
    { icon: FiMessageSquare, label: "Quote", snippet: "\n> Your quote here\n" },
    { icon: FiImage, label: "Image", snippet: "\n![Alt text](image-url)\n" },
    { icon: FiAlertTriangle, label: "Warning", snippet: "\n> ⚠️ **Warning:** Important notice\n" }
  ];

  const insertBlock = (snippet) => {
    updateArticle({
      content: (article.content || '') + snippet
    });
  };

  return (
    <BlocksContainer>
      {blocks.map(block => (
        <BlockButton
          key={block.label}
          onClick={() => insertBlock(block.snippet)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <block.icon size={20} />
          {block.label}
        </BlockButton>
      ))}
    </BlocksContainer>
  );
}

export default AdvancedBlocks;