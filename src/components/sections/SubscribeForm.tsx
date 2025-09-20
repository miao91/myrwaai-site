import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubscribe } from '@/hooks/useSubscribe';
import { SubscriptionData } from '@/types/subscription';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(1, 'Please select your role'),
  region: z.string().min(1, 'Please select your region'),
  interests: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubscribeFormProps {
  onSuccess: () => void;
}

const roleOptions = [
  { value: 'founder', label: 'Founder/CEO' },
  { value: 'compliance', label: 'Compliance Officer' },
  { value: 'legal', label: 'Legal Counsel' },
  { value: 'developer', label: 'Developer' },
  { value: 'investor', label: 'Investor' },
  { value: 'other', label: 'Other' },
];

const regionOptions = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'European Union' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'other', label: 'Other' },
];

const interestOptions = [
  { value: 'defi', label: 'DeFi Regulations' },
  { value: 'custody', label: 'Asset Custody' },
  { value: 'trading', label: 'Trading Compliance' },
  { value: 'licensing', label: 'Licensing Requirements' },
  { value: 'tax', label: 'Tax Obligations' },
];

export function SubscribeForm({ onSuccess }: SubscribeFormProps) {
  const { t } = useTranslation();
  const { subscribe, isLoading } = useSubscribe();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      role: '',
      region: '',
      interests: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    const success = await subscribe(data as SubscriptionData);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('home:waitlist.form.email')}</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('home:waitlist.form.name')}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('home:waitlist.form.role')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('home:waitlist.form.region')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{t('home:waitlist.form.interests')}</FormLabel>
                <FormDescription>
                  Select the areas you're most interested in
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="interests"
                    render={({ field: checkboxField }) => {
                      return (
                        <FormItem
                          key={option.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={checkboxField.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? checkboxField.onChange([...checkboxField.value!, option.value])
                                  : checkboxField.onChange(
                                      checkboxField.value?.filter((value) => value !== option.value)
                                    );
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Submitting...' : t('home:waitlist.form.submit')}
        </Button>
      </form>
    </Form>
  );
}