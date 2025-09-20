import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubscribeForm } from '@/components/sections/SubscribeForm';
import { SubscriptionData } from '@/types/subscription';

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('home:waitlist.title')}</DialogTitle>
          <DialogDescription>{t('home:waitlist.description')}</DialogDescription>
        </DialogHeader>
        
        {!isSuccess ? (
          <SubscribeForm onSuccess={handleSuccess} />
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold mb-2">{t('home:waitlist.form.success')}</h3>
            <p className="text-muted-foreground">You can close this window.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}