import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';
import { usePolicyStore } from '@/stores/policyStore';

const regionOptions = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'European Union' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'asia', label: 'Asia Pacific' },
];

const topicOptions = [
  { value: 'defi', label: 'DeFi' },
  { value: 'stablecoins', label: 'Stablecoins' },
  { value: 'custody', label: 'Custody' },
  { value: 'licensing', label: 'Licensing' },
  { value: 'trading', label: 'Trading' },
  { value: 'securities', label: 'Securities' },
];

const timeRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'year', label: 'Last Year' },
];

const importanceOptions = [
  { value: 'high', label: 'High', color: 'destructive' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'low', label: 'Low', color: 'secondary' },
];

export function PolicyFilterBar() {
  const { t } = useTranslation();
  const { filters, setFilters, clearFilters } = usePolicyStore();

  const handleSearchChange = (value: string) => {
    setFilters({ searchQuery: value });
  };

  const handleRegionToggle = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    setFilters({ regions: newRegions });
  };

  const handleTopicToggle = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    setFilters({ topics: newTopics });
  };

  const handleImportanceToggle = (importance: string) => {
    const newImportance = filters.importance.includes(importance as any)
      ? filters.importance.filter(i => i !== importance)
      : [...filters.importance, importance as any];
    setFilters({ importance: newImportance });
  };

  const hasActiveFilters = filters.regions.length > 0 || 
    filters.topics.length > 0 || 
    filters.timeRange !== 'all' || 
    filters.importance.length > 0 ||
    filters.searchQuery.length > 0;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('features:policyTracking.filters.search')}
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filters.timeRange}
          onValueChange={(value) => setFilters({ timeRange: value as any })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Region Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Regions</h4>
        <div className="flex flex-wrap gap-2">
          {regionOptions.map((region) => (
            <Badge
              key={region.value}
              variant={filters.regions.includes(region.value) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleRegionToggle(region.value)}
            >
              {region.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Topic Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Topics</h4>
        <div className="flex flex-wrap gap-2">
          {topicOptions.map((topic) => (
            <Badge
              key={topic.value}
              variant={filters.topics.includes(topic.value) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTopicToggle(topic.value)}
            >
              {topic.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Importance Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Importance</h4>
        <div className="flex flex-wrap gap-2">
          {importanceOptions.map((importance) => (
            <Badge
              key={importance.value}
              variant={filters.importance.includes(importance.value as any) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleImportanceToggle(importance.value)}
            >
              {importance.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          {t('features:policyTracking.filters.clear')}
        </Button>
      )}
    </div>
  );
}