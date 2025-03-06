import { useState, useEffect } from 'react';

export interface ContactInfo {
  phone: string;
  email?: string;
  address?: string;
  work_hours?: {
    monday_friday: string;
    saturday_sunday: string;
  };
  social_links?: {
    whatsapp?: {
      enabled: boolean;
      username: string;
    };
    telegram?: {
      enabled: boolean;
      username: string;
    };
    vk?: {
      enabled: boolean;
      username: string;
    };
  };
}

export const useContacts = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        
        const data = await response.json();
        setContactInfo(data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Не удалось загрузить контактную информацию');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contactInfo, loading, error };
}; 