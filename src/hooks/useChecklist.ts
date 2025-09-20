import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ComplianceChecklist, ComplianceWizardData, ChecklistItem } from '@/types/compliance';
import { getComplianceChecklist } from '@/data/complianceRules';
import { useComplianceStore } from '@/stores/complianceStore';

export function useChecklist() {
  const { t } = useTranslation();
  const { addChecklist, saveDraft } = useComplianceStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChecklist = async (wizardData: ComplianceWizardData): Promise<ComplianceChecklist | null> => {
    setIsGenerating(true);
    
    try {
      const items = getComplianceChecklist(wizardData.region, wizardData.assetType, wizardData.scenario);
      
      if (items.length === 0) {
        toast.error('No compliance requirements found for the selected criteria');
        return null;
      }

      const checklist: ComplianceChecklist = {
        id: `checklist-${Date.now()}`,
        title: `Compliance Checklist - ${wizardData.region.toUpperCase()} ${wizardData.assetType} ${wizardData.scenario}`,
        description: `Generated compliance requirements for ${wizardData.assetType} ${wizardData.scenario} in ${wizardData.region.toUpperCase()}`,
        items: items.map(item => ({ ...item, completed: false })),
        metadata: {
          region: wizardData.region,
          assetType: wizardData.assetType,
          scenario: wizardData.scenario,
          createdAt: new Date().toISOString(),
        },
      };

      return checklist;
    } catch (error) {
      console.error('Error generating checklist:', error);
      toast.error('Failed to generate compliance checklist');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveChecklist = (checklist: ComplianceChecklist) => {
    addChecklist(checklist);
    toast.success('Compliance checklist saved successfully');
  };

  const saveAsDraft = (checklist: ComplianceChecklist) => {
    saveDraft(checklist);
    toast.success('Draft saved successfully');
  };

  const exportToMarkdown = (checklist: ComplianceChecklist): string => {
    const markdown = `# ${checklist.title}

${checklist.description}

Generated on: ${new Date(checklist.metadata.createdAt).toLocaleDateString()}

## Compliance Requirements

${checklist.items.map((item, index) => `
### ${index + 1}. ${item.title}

**Category:** ${item.category}  
**Priority:** ${item.priority.toUpperCase()}  
**Required:** ${item.isRequired ? 'Yes' : 'No'}  
${item.estimatedTime ? `**Estimated Time:** ${item.estimatedTime}  ` : ''}

${item.description}

${item.resources ? `**Resources:**\n${item.resources.map(resource => `- ${resource}`).join('\n')}` : ''}
`).join('\n---\n')}

## Summary

- **Total Requirements:** ${checklist.items.length}
- **High Priority:** ${checklist.items.filter(item => item.priority === 'high').length}
- **Medium Priority:** ${checklist.items.filter(item => item.priority === 'medium').length}
- **Low Priority:** ${checklist.items.filter(item => item.priority === 'low').length}
`;

    return markdown;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return {
    generateChecklist,
    saveChecklist,
    saveAsDraft,
    exportToMarkdown,
    copyToClipboard,
    isGenerating,
  };
}