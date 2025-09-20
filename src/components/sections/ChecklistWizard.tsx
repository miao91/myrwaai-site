import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronRight, ChevronLeft, Download, Copy } from 'lucide-react';
import { useChecklist } from '@/hooks/useChecklist';
import { useComplianceStore } from '@/stores/complianceStore';
import { ComplianceWizardData, ComplianceChecklist } from '@/types/compliance';

const regions = [
  { value: 'us', label: 'United States', flag: '🇺🇸' },
  { value: 'eu', label: 'European Union', flag: '🇪🇺' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
];

const assetTypes = [
  { value: 'securities', label: 'Securities', icon: '📈' },
  { value: 'commodities', label: 'Commodities', icon: '🛢️' },
  { value: 'mica', label: 'Crypto Assets (MiCA)', icon: '₿' },
  { value: 'fca', label: 'FCA Regulated', icon: '🏦' },
  { value: 'mas', label: 'MAS Regulated', icon: '🏛️' },
];

const scenarios = [
  { value: 'exchange', label: 'Exchange Operations' },
  { value: 'custody', label: 'Custody Services' },
  { value: 'stablecoin', label: 'Stablecoin Issuance' },
];

export function ChecklistWizard() {
  const { t } = useTranslation();
  const { generateChecklist, isGenerating } = useChecklist();
  const { currentWizard } = useComplianceStore();
  const [activeTab, setActiveTab] = useState('parameters');
  const [wizardData, setWizardData] = useState<ComplianceWizardData>({
    region: '',
    assetType: '',
    scenario: '',
  });
  const [generatedChecklist, setGeneratedChecklist] = useState<ComplianceChecklist | null>(null);

  const handleGenerate = async () => {
    if (!wizardData.region || !wizardData.assetType || !wizardData.scenario) {
      return;
    }

    const checklist = await generateChecklist(wizardData);
    if (checklist) {
      setGeneratedChecklist(checklist);
      setActiveTab('result');
    }
  };

  const canProceed = () => {
    switch (activeTab) {
      case 'parameters':
        return wizardData.region && wizardData.assetType && wizardData.scenario;
      default:
        return true;
    }
  };

  const nextTab = () => {
    const tabs = ['parameters', 'result'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1 && canProceed()) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ['parameters', 'result'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('features.compliance.title')}</CardTitle>
          <CardDescription>
            {t('features.compliance.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parameters" disabled={activeTab === 'result'}>
                Parameters
              </TabsTrigger>
              <TabsTrigger value="result" disabled={!generatedChecklist}>
                Result
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select
                    value={wizardData.region}
                    onValueChange={(value) => setWizardData({ ...wizardData, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          <span className="flex items-center gap-2">
                            <span>{region.flag}</span>
                            <span>{region.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Type</label>
                  <Select
                    value={wizardData.assetType}
                    onValueChange={(value) => setWizardData({ ...wizardData, assetType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Scenario</label>
                  <Select
                    value={wizardData.scenario}
                    onValueChange={(value) => setWizardData({ ...wizardData, scenario: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario.value} value={scenario.value}>
                          {scenario.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevTab} disabled={activeTab === 'parameters'}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleGenerate} disabled={!canProceed() || isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Checklist'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="result" className="space-y-6 mt-6">
              {generatedChecklist && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{generatedChecklist.title}</h3>
                    <p className="text-sm text-muted-foreground">{generatedChecklist.description}</p>
                    
                    <div className="flex gap-2 pt-2">
                      <Badge variant="outline">
                        {generatedChecklist.items.length} Requirements
                      </Badge>
                      <Badge variant="destructive">
                        {generatedChecklist.items.filter(item => item.priority === 'high').length} High Priority
                      </Badge>
                      <Badge variant="secondary">
                        {generatedChecklist.items.filter(item => item.priority === 'medium').length} Medium Priority
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {generatedChecklist.items.map((item, index) => (
                      <Card key={item.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-base">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </div>
                            <Badge 
                              variant={item.priority === 'high' ? 'destructive' : 
                                     item.priority === 'medium' ? 'secondary' : 'outline'}
                            >
                              {item.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <span>Category: {item.category}</span>
                              {item.estimatedTime && <span>Time: {item.estimatedTime}</span>}
                              {item.isRequired && <span className="text-red-600">Required</span>}
                            </div>
                            {item.resources && (
                              <div className="pt-2">
                                <p className="font-medium text-xs">Resources:</p>
                                <ul className="text-xs space-y-1 mt-1">
                                  {item.resources.map((resource, idx) => (
                                    <li key={idx} className="text-muted-foreground">• {resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button className="ml-auto">
                      Save Checklist
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}