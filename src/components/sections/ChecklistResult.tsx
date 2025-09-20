import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Calendar,
  Clock,
  AlertTriangle,
  Info 
} from 'lucide-react';
import { ComplianceChecklist, ChecklistItem } from '@/types/compliance';
import { useComplianceStore } from '@/stores/complianceStore';
import { useChecklist } from '@/hooks/useChecklist';

interface ChecklistResultProps {
  checklist: ComplianceChecklist;
  onClose?: () => void;
}

export function ChecklistResult({ checklist, onClose }: ChecklistResultProps) {
  const { t } = useTranslation();
  const { deleteChecklist } = useComplianceStore();
  const { exportToMarkdown, copyToClipboard } = useChecklist();
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const completionRate = Math.round((completedItems.size / checklist.items.length) * 100);

  const handleExport = async (format: 'markdown' | 'json') => {
    setIsExporting(true);
    try {
      if (format === 'markdown') {
        const markdown = exportToMarkdown(checklist);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${checklist.title.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const json = JSON.stringify(checklist, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${checklist.title.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySummary = async () => {
    const summary = `# ${checklist.title}

${checklist.description}

**Completion:** ${completionRate}% (${completedItems.size}/${checklist.items.length})
**Created:** ${new Date(checklist.metadata.createdAt).toLocaleDateString()}

## Summary
- Total Requirements: ${checklist.items.length}
- High Priority: ${checklist.items.filter(item => item.priority === 'high').length}
- Medium Priority: ${checklist.items.filter(item => item.priority === 'medium').length}
- Low Priority: ${checklist.items.filter(item => item.priority === 'low').length}
- Completed: ${completedItems.size}
- Remaining: ${checklist.items.length - completedItems.size}`;
    
    await copyToClipboard(summary);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const groupedItems = checklist.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{checklist.title}</CardTitle>
              <CardDescription>{checklist.description}</CardDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(checklist.metadata.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {checklist.items.length} items
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {completionRate}% complete
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopySummary}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Summary
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline">{checklist.items.length} Total</Badge>
                <Badge variant="destructive">
                  {checklist.items.filter(item => item.priority === 'high').length} High Priority
                </Badge>
                <Badge variant="secondary">
                  {checklist.items.filter(item => item.priority === 'medium').length} Medium Priority
                </Badge>
                <Badge variant="outline">
                  {checklist.items.filter(item => item.priority === 'low').length} Low Priority
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('markdown')}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export MD
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{category}</CardTitle>
            <CardDescription>
              {items.length} requirement{items.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={completedItems.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(item.priority)}
                      <h4 className={`font-medium ${completedItems.has(item.id) ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </h4>
                    </div>
                    <Badge variant={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm ${completedItems.has(item.id) ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {item.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.estimatedTime}
                      </span>
                    )}
                    {item.isRequired && (
                      <span className="text-red-600 font-medium">Required</span>
                    )}
                  </div>
                  
                  {item.resources && item.resources.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Resources:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.resources.map((resource, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => deleteChecklist(checklist.id)}
        >
          Delete Checklist
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCompletedItems(new Set())}>
            Reset Progress
          </Button>
          <Button variant="outline" onClick={() => setCompletedItems(new Set(checklist.items.map(item => item.id)))}>
            Mark All Complete
          </Button>
        </div>
      </div>
    </div>
  );
}