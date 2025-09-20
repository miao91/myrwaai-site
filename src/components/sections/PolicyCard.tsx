import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, ExternalLink, Heart, Tag, MapPin, Star } from 'lucide-react';
import { Policy } from '@/types/policy';
import { usePolicyStore } from '@/stores/policyStore';

interface PolicyCardProps {
  policy: Policy;
}

export function PolicyCard({ policy }: PolicyCardProps) {
  const { t, i18n } = useTranslation();
  const { favorites, toggleFavorite } = usePolicyStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const isFavorited = favorites.includes(policy.id);
  const isChinese = i18n.language === 'cn';

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isChinese ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFavoriteClick = () => {
    toggleFavorite(policy.id);
  };

  const handleExternalLink = () => {
    window.open(policy.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pin indicator */}
      {policy.isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">
            {isChinese ? policy.titleCN : policy.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} 
            />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(policy.publishDate)}
          </span>
          {policy.effectiveDate && (
            <>
              <Separator orientation="vertical" className="h-3" />
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Effective: {formatDate(policy.effectiveDate)}
              </span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <CardDescription className="line-clamp-3 mb-4">
          {isChinese ? policy.summaryCN : policy.summary}
        </CardDescription>

        {/* Regions */}
        <div className="flex flex-wrap gap-1 mb-3">
          {policy.region.map((region) => (
            <Badge key={region} variant="outline" className="text-xs">
              <MapPin className="h-2 w-2 mr-1" />
              {region.toUpperCase()}
            </Badge>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {policy.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-2">
          <Badge variant={getImportanceColor(policy.importance)}>
            {policy.importance.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {policy.readTime} {t('features:policyTracking.card.readTime')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {t('features:policyTracking.card.source')}: {policy.source}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleExternalLink}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>

      {/* Hover overlay with key points */}
      {isHovered && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center">
          <h4 className="font-semibold mb-2">Key Points:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• {isChinese ? '影响多个司法管辖区' : 'Affects multiple jurisdictions'}</li>
            <li>• {isChinese ? '需要合规审查' : 'Requires compliance review'}</li>
            <li>• {isChinese ? '可能影响业务运营' : 'May impact business operations'}</li>
          </ul>
          <Button className="mt-4" size="sm">
            {t('features:policyTracking.card.readMore')}
          </Button>
        </div>
      )}
    </Card>
  );
}