import React from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaBriefcase } from 'react-icons/fa';
import { SiHeadlessui } from 'react-icons/si';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Platform } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const QuickAddContainer = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;
`;

const QuickAddButton = styled(motion.button)<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${props => props.$color};
  color: white;
  font-size: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: calc(100% + 0.5rem);
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows.small};
  pointer-events: none;
`;

interface QuickAddMenuProps {
  onAddApplication: (platform: Platform) => void;
}

const QuickAddMenu: React.FC<QuickAddMenuProps> = ({ onAddApplication }) => {
  const { t } = useTranslation();
  
  const handleQuickAdd = (platform: Platform) => {
    onAddApplication(platform);
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };
  
  return (
    <QuickAddContainer>
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={buttonVariants}
        whileHover={{ scale: 1.1 }}
      >
        <QuickAddButton
          $color="#0077B5"
          onClick={() => handleQuickAdd('LinkedIn')}
          aria-label={t('quickAdd.addToLinkedin')}
        >
          <FaLinkedin />
          <Tooltip
            initial={{ opacity: 0, x: 5 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {t('quickAdd.addToLinkedin')}
          </Tooltip>
        </QuickAddButton>
      </motion.div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={buttonVariants}
        whileHover={{ scale: 1.1 }}
      >
        <QuickAddButton
          $color="#0CAA41"
          onClick={() => handleQuickAdd('Glassdoor')}
          aria-label={t('quickAdd.addToGlassdoor')}
        >
          <FaBriefcase />
          <Tooltip
            initial={{ opacity: 0, x: 5 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {t('quickAdd.addToGlassdoor')}
          </Tooltip>
        </QuickAddButton>
      </motion.div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        custom={2}
        variants={buttonVariants}
        whileHover={{ scale: 1.1 }}
      >
        <QuickAddButton
          $color="#D6001C"
          onClick={() => handleQuickAdd('HeadHunter')}
          aria-label={t('quickAdd.addToHeadhunter')}
        >
          <SiHeadlessui />
          <Tooltip
            initial={{ opacity: 0, x: 5 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {t('quickAdd.addToHeadhunter')}
          </Tooltip>
        </QuickAddButton>
      </motion.div>
    </QuickAddContainer>
  );
};

export default QuickAddMenu; 