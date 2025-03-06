export const formatPhoneNumber = (phone: string): string => {
  // Убираем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '');
  
  // Форматируем номер в виде +7 (XXX) XXX-XX-XX
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  
  return phone;
}; 