import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Platform, Application, Status } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FormOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const FormContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

interface ApplicationFormProps {
  initialData?: Application;
  onSubmit: (data: Application | Omit<Application, 'id'>) => void | Promise<void>;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  initialData,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Partial<Application>>({
    company: '',
    position: 'Frontend',
    platform: 'LinkedIn',
    status: 'Applied',
    date: new Date().toISOString().substring(0, 10),
    remote: false,
    favorite: false,
    folder: 'responses'
  });
  
  // Установка начальных данных при редактировании
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: isChecked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Если редактирование - сохраняем с тем же id
    if (initialData?.id) {
      onSubmit({
        ...formData,
        id: initialData.id
      } as Application);
    } else {
      // Если новая запись - id будет сгенерирован в handleAddApplication
      onSubmit(formData as Omit<Application, 'id'>);
    }
  };
  
  const isEdit = Boolean(initialData?.id);
  
  return (
    <FormOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormContainer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <FormTitle>
          {isEdit ? t('form.editApplication') || 'Редактировать заявку' : t('form.addApplication') || 'Добавить заявку'}
        </FormTitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="company">{t('form.company')}</Label>
            <Input
              type="text"
              id="company"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
              placeholder={t('form.companyPlaceholder') || 'Например: Яндекс'}
              required
            />
          </FormGroup>
          
          <Row>
            <FormGroup>
              <Label htmlFor="position">{t('form.position')}</Label>
              <Select
                id="position"
                name="position"
                value={formData.position || 'Frontend'}
                onChange={handleChange}
                required
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="DevOps">DevOps</option>
                <option value="QA">QA</option>
                <option value="UX/UI">UX/UI</option>
                <option value="Data Science">Data Science</option>
                <option value="Other">Другое</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="platform">{t('form.platform')}</Label>
              <Select
                id="platform"
                name="platform"
                value={formData.platform || 'LinkedIn'}
                onChange={handleChange}
                required
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="HeadHunter">HeadHunter</option>
                <option value="Indeed">Indeed</option>
                <option value="Прямой контакт">Прямой контакт</option>
                <option value="Other">Другое</option>
              </Select>
            </FormGroup>
          </Row>
          
          <Row>
            <FormGroup>
              <Label htmlFor="date">{t('form.date')}</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date || new Date().toISOString().substring(0, 10)}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="status">{t('form.status')}</Label>
              <Select
                id="status"
                name="status"
                value={formData.status || 'Applied'}
                onChange={handleChange}
                required
              >
                <option value="Applied">Отправлено</option>
                <option value="Viewed">Просмотрено</option>
                <option value="Interview">Интервью</option>
                <option value="Offer">Оффер</option>
                <option value="Rejected">Отказ</option>
              </Select>
            </FormGroup>
          </Row>
          
          <FormGroup>
            <Label htmlFor="salary">{t('form.salary')}</Label>
            <Input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary || ''}
              onChange={handleChange}
              placeholder={t('form.salaryPlaceholder') || 'Зарплата в рублях'}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="location">{t('form.location')}</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder={t('form.locationPlaceholder') || 'Например: Москва'}
            />
          </FormGroup>
          
          <FormGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="remote"
                checked={Boolean(formData.remote)}
                onChange={handleChange}
              />
              {t('form.remote')}
            </CheckboxLabel>
          </FormGroup>
          
          <FormGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="favorite"
                checked={Boolean(formData.favorite)}
                onChange={handleChange}
              />
              {t('form.favorite')}
            </CheckboxLabel>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="notes">{t('form.notes')}</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder={t('form.notesPlaceholder') || 'Ваши заметки о вакансии'}
            />
          </FormGroup>
          
          <FormActions>
            <Button variant="outline" type="button" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            
            <Button variant="primary" type="submit">
              {isEdit ? t('common.save') || 'Сохранить' : t('common.add') || 'Добавить'}
            </Button>
          </FormActions>
        </form>
      </FormContainer>
    </FormOverlay>
  );
};

export default ApplicationForm; 