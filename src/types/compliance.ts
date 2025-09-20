export interface ComplianceChecklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  metadata: {
    region: string;
    assetType: string;
    scenario: string;
    createdAt: string;
  };
}

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  isRequired: boolean;
  estimatedTime?: string;
  resources?: string[];
  completed?: boolean;
}

export interface ComplianceWizardData {
  region: string;
  assetType: string;
  scenario: string;
  additionalRequirements?: string[];
}

export interface ComplianceStore {
  checklists: ComplianceChecklist[];
  currentWizard: ComplianceWizardData | null;
  drafts: ComplianceChecklist[];
  addChecklist: (checklist: ComplianceChecklist) => void;
  saveDraft: (checklist: ComplianceChecklist) => void;
  deleteChecklist: (id: string) => void;
  setCurrentWizard: (data: ComplianceWizardData | null) => void;
}