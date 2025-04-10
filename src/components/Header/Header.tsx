import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaChartBar, FaGlobe, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import Button from '../shared/Button';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: relative;
  z-index: 100;
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
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MobileButtonGroup = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  z-index: 999;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileMenuButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  
  svg {
    font-size: 1.2rem;
  }
`;

const LanguageMenu = styled.div`
  position: relative;
`;

const LanguageDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: 0.5rem 0;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 10;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: static;
    margin-top: 1rem;
    width: 100%;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const LanguageOption = styled.button<{ active: boolean }>`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background-color: ${({ active, theme }) => active ? theme.colors.backgroundHover || 'rgba(0,0,0,0.05)' : 'transparent'};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover || 'rgba(0,0,0,0.05)'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.8rem 1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundHover || 'rgba(0,0,0,0.05)'};
  border-radius: ${({ theme }) => theme.radius.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
  }
`;

const UserIcon = styled(FaUser)`
  color: ${({ theme }) => theme.colors.primary};
`;

const ThemeSwitcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surfaceVariant};
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ThemeOption = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${({ active }) => active ? 1 : 0.6};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const ThemeCircle = styled.div<{ mode: 'light' | 'dark'; active?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ mode }) => 
    mode === 'light' 
      ? 'linear-gradient(145deg, #FFFFFF, #F0F0F0)' 
      : 'linear-gradient(145deg, #2D2D2D, #1A1A1A)'};
  color: ${({ mode }) => mode === 'light' ? '#1A1A1A' : '#FFFFFF'};
  border: 3px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
`;

const ThemeButton = styled(Button)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const { t } = useTranslation();
  const { language, changeLanguage } = useSettings();
  const { user, logout, isAuthenticated } = useAuth();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>{t('common.jobTracker')}</Title>
        
        {/* Desktop buttons */}
        <ButtonGroup>
          {isAuthenticated && user && (
            <UserInfo>
              <UserIcon size={16} />
              <span>{user.name}</span>
            </UserInfo>
          )}
          
          <LanguageMenu>
            <Button 
              variant="icon" 
              onClick={toggleLanguageMenu}
              aria-label={t('header.language')}
            >
              <FaGlobe size={20} />
            </Button>
            <LanguageDropdown isOpen={isLanguageMenuOpen}>
              <LanguageOption 
                active={language === 'ru'} 
                onClick={() => {
                  changeLanguage('ru');
                  setIsLanguageMenuOpen(false);
                }}
              >
                Русский
              </LanguageOption>
              <LanguageOption 
                active={language === 'en'} 
                onClick={() => {
                  changeLanguage('en');
                  setIsLanguageMenuOpen(false);
                }}
              >
                English
              </LanguageOption>
            </LanguageDropdown>
          </LanguageMenu>
          
          <ThemeButton 
            variant="icon" 
            onClick={onThemeToggle}
            aria-label={isDarkMode ? t('header.switchToLight') : t('header.switchToDark')}
          >
            {isDarkMode ? <BsSunFill size={24} /> : <BsMoonFill size={24} />}
          </ThemeButton>
          
          {isAuthenticated && (
            <>
              <Button 
                variant="primary" 
                onClick={onAddClick}
                aria-label={t('common.addApplication')}
              >
                <FaPlus size={20} />
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={onStatsClick}
                aria-label={t('common.viewStatistics')}
              >
                <FaChartBar size={20} />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                aria-label={t('auth.logout')}
              >
                <FaSignOutAlt size={18} />
              </Button>
            </>
          )}
        </ButtonGroup>
        
        {/* Mobile menu button */}
        <MobileButtonGroup>
          <Button 
            variant="icon" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <FaBars size={20} />
          </Button>
        </MobileButtonGroup>
      </HeaderContent>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
          >
            <MobileMenuHeader>
              <Title>{t('common.jobTracker')}</Title>
              <Button 
                variant="icon" 
                onClick={toggleMobileMenu}
                aria-label="Закрыть меню"
              >
                <FaTimes size={20} />
              </Button>
            </MobileMenuHeader>
            
            <MobileMenuButtons>
              {isAuthenticated && user && (
                <UserInfo>
                  <UserIcon size={18} />
                  <span>{user.name}</span>
                </UserInfo>
              )}
              
              <ThemeSwitcher>
                <ThemeOption 
                  active={!isDarkMode} 
                  onClick={() => {
                    if (isDarkMode) onThemeToggle();
                  }}
                >
                  <ThemeCircle mode="light" active={!isDarkMode}>
                    <BsSunFill size={24} />
                  </ThemeCircle>
                </ThemeOption>
                
                <ThemeOption 
                  active={isDarkMode} 
                  onClick={() => {
                    if (!isDarkMode) onThemeToggle();
                  }}
                >
                  <ThemeCircle mode="dark" active={isDarkMode}>
                    <BsMoonFill size={24} />
                  </ThemeCircle>
                </ThemeOption>
              </ThemeSwitcher>
              
              <MobileMenuButton 
                variant="outline" 
                onClick={toggleLanguageMenu}
              >
                <FaGlobe size={20} />
                <span>{t('header.language')}</span>
              </MobileMenuButton>
              
              {isAuthenticated && (
                <>
                  <MobileMenuButton 
                    variant="primary" 
                    onClick={() => {
                      onAddClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FaPlus size={20} />
                    <span>{t('common.addApplication')}</span>
                  </MobileMenuButton>
                  
                  <MobileMenuButton 
                    variant="secondary" 
                    onClick={() => {
                      onStatsClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FaChartBar size={20} />
                    <span>{t('common.viewStatistics')}</span>
                  </MobileMenuButton>
                  
                  <MobileMenuButton 
                    variant="outline" 
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt size={18} />
                    <span>{t('auth.logout')}</span>
                  </MobileMenuButton>
                </>
              )}
            </MobileMenuButtons>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header; 