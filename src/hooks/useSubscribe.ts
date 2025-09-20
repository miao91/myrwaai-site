import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SubscriptionData, SubscriptionResponse } from '@/types/subscription';

export function useSubscribe() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (data: SubscriptionData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      const result: SubscriptionResponse = await response.json();

      if (result.success) {
        toast.success(t('home:waitlist.form.success'));
        return true;
      } else {
        toast.error(result.message || 'Subscription failed');
        return false;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/subscribe/check?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  };

  return {
    subscribe,
    checkEmailExists,
    isLoading,
  };
}