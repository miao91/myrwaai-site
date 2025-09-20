import { useTranslation } from 'react-i18next';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink, X } from 'lucide-react';
import { usePolicyStore } from '@/stores/policyStore';
import { formatDistanceToNow } from 'date-fns';

interface FavoritesDrawerProps {
  trigger: React.ReactNode;
}

export function FavoritesDrawer({ trigger }: FavoritesDrawerProps) {
  const { t, i18n } = useTranslation();
  const { favorites, policies, toggleFavorite } = usePolicyStore();
  const isChinese = i18n.language === 'cn';

  const favoritePolicies = policies.filter(policy => favorites.includes(policy.id));

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: isChinese ? require('date-fns/locale/zh-CN') : undefined });
  };

  const exportFavorites = () => {
    const data = favoritePolicies.map(policy => ({
      title: isChinese ? policy.titleCN : policy.title,
      summary: isChinese ? policy.summaryCN : policy.summary,
      source: policy.source,
      publishDate: policy.publishDate,
      url: policy.sourceUrl,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorite-policies.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>{t('features:favorites.title')}</DrawerTitle>
                <DrawerDescription>
                  {favoritePolicies.length} {favoritePolicies.length === 1 ? 'policy' : 'policies'} saved
                </DrawerDescription>
              </div>
              {favoritePolicies.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportFavorites}>
                  {t('features:favorites.export')}
                </Button>
              )}
            </div>
          </DrawerHeader>

          <div className="p-4 pb-8">
            {favoritePolicies.length === 0 ? (
              <Card className="border-dashed">
                <CardHeader className="text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle>{t('features:favorites.empty')}</CardTitle>
                  <CardDescription>
                    Start adding policies to your favorites by clicking the heart icon on any policy card.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {favoritePolicies.map((policy) => (
                  <Card key={policy.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
                      onClick={() => toggleFavorite(policy.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <CardHeader className="pb-3 pr-10">
                      <CardTitle className="text-base line-clamp-2">
                        {isChinese ? policy.titleCN : policy.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatRelativeTime(policy.publishDate)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <CardDescription className="text-sm line-clamp-2 mb-3">
                        {isChinese ? policy.summaryCN : policy.summary}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {policy.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between pt-3">
                      <Badge variant="outline" className="text-xs">
                        {policy.source}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => window.open(policy.sourceUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}