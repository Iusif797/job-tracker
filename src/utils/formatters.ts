/**
 * Форматирует дату в удобочитаемый формат
 * @param dateString Строка с датой в формате ISO
 * @returns Отформатированная дата в локальном формате
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Форматирует зарплату: добавляет разделители и символ валюты
 * @param salary Число или строка с числом
 * @param currency Символ валюты
 * @returns Отформатированную строку с зарплатой
 */
export const formatSalary = (
  salary?: number | string,
  currency: string = '₽'
): string => {
  if (!salary) return '';
  
  const numSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
  if (isNaN(numSalary)) return '';
  
  return `${numSalary.toLocaleString('ru-RU')} ${currency}`;
}; 