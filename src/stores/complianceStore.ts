import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComplianceStore, ComplianceChecklist, ComplianceWizardData } from '@/types/compliance';

export const useComplianceStore = create<ComplianceStore>()(
  persist(
    (set, get) => ({
      checklists: [],
      currentWizard: null,
      drafts: [],

      addChecklist: (checklist) => {
        set({ checklists: [checklist, ...get().checklists] });
      },

      saveDraft: (checklist) => {
        set({ drafts: [checklist, ...get().drafts] });
      },

      deleteChecklist: (id) => {
        set({
          checklists: get().checklists.filter(c => c.id !== id),
          drafts: get().drafts.filter(d => d.id !== id),
        });
      },

      setCurrentWizard: (data) => {
        set({ currentWizard: data });
      },
    }),
    {
      name: 'compliance-store',
      partialize: (state) => ({
        checklists: state.checklists,
        drafts: state.drafts,
      }),
    }
  )
);