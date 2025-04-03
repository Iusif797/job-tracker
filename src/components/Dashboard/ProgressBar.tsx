import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  progress: number; // число от 0 до 1
  color?: string;
  height?: string;
}

interface ProgressBarContainerProps {
  $height?: string;
}

interface ProgressFillProps {
  $progress: number;
  $color?: string;
}

// Компонент для отображения прогресс-бара
const ProgressBarContainer = styled.div<ProgressBarContainerProps>`
  width: 100%;
  height: ${({ $height }) => $height || '10px'};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  margin: 0.5rem 0 1rem;
`;

const ProgressFill = styled.div<ProgressFillProps>`
  height: 100%;
  width: ${({ $progress }) => `${$progress * 100}%`};
  background-color: ${({ theme, $color }) => $color || theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color, 
  height = '10px' 
}) => {
  // Ограничиваем прогресс от 0 до 1
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(normalizedProgress * 100);
  
  return (
    <div>
      <ProgressBarContainer $height={height}>
        <ProgressFill $progress={normalizedProgress} $color={color} />
      </ProgressBarContainer>
      
      <ProgressText>
        <span>{percentage}% завершено</span>
        <span>{`${percentage} / 100`}</span>
      </ProgressText>
    </div>
  );
};

export default ProgressBar; 