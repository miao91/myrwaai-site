import { useTranslation } from 'react-i18next';
import { PolicyCard } from '@/components/sections/PolicyCard';
import { usePolicyStore } from '@/stores/policyStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Search } from 'lucide-react';

export function PolicyList() {
  const { t } = useTranslation();
  const { filteredPolicies, isLoading } = usePolicyStore();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
                <div className="h-3 bg-muted rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredPolicies.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>{t('common:messages.noData')}</CardTitle>
          <CardDescription>
            Try adjusting your filters or search terms to find relevant policies.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPolicies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  );
}