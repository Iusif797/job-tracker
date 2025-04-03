import React from 'react';
import styled from 'styled-components';
import { FaPlus, FaChartBar } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import Button from '../shared/Button';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

interface HeaderProps {
  onAddClick: () => void;
  onStatsClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddClick, 
  onStatsClick, 
  onThemeToggle,
  isDarkMode 
}) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>Job Application Tracker</Title>
        <ButtonGroup>
          <Button 
            variant="icon" 
            onClick={onThemeToggle}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? React.createElement(BsSunFill, { size: 20 }) : React.createElement(BsMoonFill, { size: 20 })}
          </Button>
          <Button 
            variant="primary" 
            onClick={onAddClick}
            aria-label="Add new application"
          >
            {React.createElement(FaPlus, { size: 20 })}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onStatsClick}
            aria-label="View statistics"
          >
            {React.createElement(FaChartBar, { size: 20 })}
          </Button>
        </ButtonGroup>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 