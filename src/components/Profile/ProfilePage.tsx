import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import Button from '../shared/Button';
import { FaSave, FaUser } from 'react-icons/fa';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const ProfileIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ProfileTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.success};
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (user) {
        await updateProfile(user, {
          displayName: name
        });
        setUser(user);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileIcon>
          <FaUser size={28} />
        </ProfileIcon>
        <ProfileTitle>{t('profile.title')}</ProfileTitle>
      </ProfileHeader>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">{t('auth.name')}</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.namePlaceholder')}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            placeholder={t('auth.emailPlaceholder')}
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{t('profile.updateSuccess')}</SuccessMessage>}
        
        <ProfileActions>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            <FaSave size={16} style={{ marginRight: '8px' }} />
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </ProfileActions>
      </form>
    </ProfileContainer>
  );
};

export default ProfilePage; 