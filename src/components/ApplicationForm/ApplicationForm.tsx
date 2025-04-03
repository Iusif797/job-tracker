import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Platform, Application } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';

const FormContainer = styled(Card)`
  max-width: 600px;
  margin: 2rem auto;
`;

const FormTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  transition: border-color ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  min-height: 100px;
  transition: border-color ${({ theme }) => theme.transitions.default};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  transition: border-color ${({ theme }) => theme.transitions.default};
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

interface ApplicationFormProps {
  onSubmit: (application: Application) => void;
  onCancel: () => void;
  initialData?: Application;
  initialPlatform?: Platform | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  initialPlatform 
}) => {
  const [formData, setFormData] = useState<Omit<Application, 'id'>>({
    platform: initialData?.platform || initialPlatform || 'LinkedIn',
    date: initialData?.date || new Date().toISOString().substring(0, 10),
    position: initialData?.position || 'Frontend',
    company: initialData?.company || '',
    status: initialData?.status || 'Applied',
    notes: initialData?.notes || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newApplication: Application = {
      id: initialData?.id || uuidv4(),
      ...formData
    };
    
    onSubmit(newApplication);
  };
  
  return (
    <FormContainer>
      <FormTitle>
        {initialData ? 'Редактировать отклик' : 'Добавить новый отклик'}
      </FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="platform">Платформа</Label>
          <Select 
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
          >
            <option value="LinkedIn">LinkedIn</option>
            <option value="Glassdoor">Glassdoor</option>
            <option value="HeadHunter">HeadHunter</option>
            <option value="Other">Другое</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="date">Дата отклика</Label>
          <Input 
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="position">Должность</Label>
          <Select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="Frontend">Frontend Developer</option>
            <option value="Backend">Backend Developer</option>
            <option value="Fullstack">Fullstack Developer</option>
            <option value="DevOps">DevOps Engineer</option>
            <option value="QA">QA Engineer</option>
            <option value="UX/UI">UX/UI Designer</option>
            <option value="Data Science">Data Scientist</option>
            <option value="Other">Другое</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="company">Компания</Label>
          <Input 
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Например: Google"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="status">Статус</Label>
          <Select 
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Applied">Отправлено</option>
            <option value="Viewed">Просмотрено</option>
            <option value="Interview">Интервью</option>
            <option value="Offer">Получен оффер</option>
            <option value="Rejected">Отказ</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="notes">Заметки</Label>
          <Textarea 
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Дополнительная информация..."
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Отмена
          </Button>
          
          <Button 
            type="submit" 
            variant="primary"
          >
            {initialData ? 'Сохранить' : 'Добавить'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default ApplicationForm; 