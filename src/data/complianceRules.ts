import { ChecklistItem } from '@/types/compliance';

export const complianceRules = {
  us: {
    securities: {
      exchange: [
        {
          id: 'us-sec-1',
          category: 'Registration',
          title: 'Register with SEC as Exchange',
          description: 'File Form 1 to register as a national securities exchange or operate under an exemption.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '6-12 months',
          resources: ['SEC Form 1', 'Exchange Act Rule 3b-16'],
        },
        {
          id: 'us-sec-2',
          category: 'Compliance',
          title: 'Implement Market Surveillance',
          description: 'Establish surveillance systems to detect manipulative trading activities.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '3-6 months',
          resources: ['Market Surveillance Guidelines', 'FINRA Rules'],
        },
        {
          id: 'us-sec-3',
          category: 'Reporting',
          title: 'Establish Reporting Procedures',
          description: 'Set up systems for trade reporting and regulatory filings.',
          priority: 'medium' as const,
          isRequired: true,
          estimatedTime: '2-4 months',
          resources: ['SEC Reporting Requirements', 'Form 19b-4'],
        },
      ],
      custody: [
        {
          id: 'us-custody-1',
          category: 'Registration',
          title: 'Register as Investment Adviser',
          description: 'Register with SEC under the Investment Advisers Act if holding client assets.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '3-6 months',
          resources: ['Form ADV', 'Investment Advisers Act'],
        },
        {
          id: 'us-custody-2',
          category: 'Security',
          title: 'Implement Custody Controls',
          description: 'Establish controls for safeguarding client assets including qualified custodians.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '4-8 months',
          resources: ['Custody Rule 206(4)-2', 'SOC 1/SOC 2 Reports'],
        },
      ],
    },
    commodities: {
      exchange: [
        {
          id: 'us-cftc-1',
          category: 'Registration',
          title: 'Register with CFTC as DCM',
          description: 'Register as a Designated Contract Market for derivatives trading.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '8-12 months',
          resources: ['CFTC Form 1', 'Commodity Exchange Act'],
        },
      ],
    },
  },
  eu: {
    mica: {
      stablecoin: [
        {
          id: 'eu-mica-1',
          category: 'Authorization',
          title: 'Obtain E-Money Institution License',
          description: 'Apply for authorization as an e-money institution in an EU member state.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '6-9 months',
          resources: ['MiCA Regulation', 'E-Money Directive'],
        },
        {
          id: 'eu-mica-2',
          category: 'Capital',
          title: 'Meet Capital Requirements',
          description: 'Maintain minimum capital of €350,000 or 2% of outstanding stablecoins.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: 'Ongoing',
          resources: ['MiCA Capital Requirements', 'EBA Guidelines'],
        },
        {
          id: 'eu-mica-3',
          category: 'Reserves',
          title: 'Establish Reserve Management',
          description: 'Maintain 1:1 reserves with EU banks and provide quarterly attestations.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '3-6 months',
          resources: ['MiCA Reserve Requirements', 'Audit Standards'],
        },
      ],
      exchange: [
        {
          id: 'eu-mica-4',
          category: 'Registration',
          title: 'Register as CASP',
          description: 'Register as a Crypto-Asset Service Provider in home EU member state.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '4-8 months',
          resources: ['MiCA CASP Requirements', 'National Regulators'],
        },
      ],
    },
  },
  uk: {
    fca: {
      exchange: [
        {
          id: 'uk-fca-1',
          category: 'Registration',
          title: 'Register with FCA',
          description: 'Apply for registration as a cryptoasset exchange provider.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '6-12 months',
          resources: ['FCA Cryptoasset Registration', 'MLRs'],
        },
        {
          id: 'uk-fca-2',
          category: 'Compliance',
          title: 'Implement AML/KYC Procedures',
          description: 'Establish anti-money laundering and know-your-customer procedures.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '2-4 months',
          resources: ['FCA AML Guidance', 'JMLSG Guidelines'],
        },
      ],
      custody: [
        {
          id: 'uk-fca-3',
          category: 'Authorization',
          title: 'Obtain FCA Authorization',
          description: 'Apply for full FCA authorization for custody services.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '12-18 months',
          resources: ['FCA Handbook', 'Custody Rules'],
        },
      ],
    },
  },
  singapore: {
    mas: {
      exchange: [
        {
          id: 'sg-mas-1',
          category: 'License',
          title: 'Obtain DPT License',
          description: 'Apply for Digital Payment Token service license from MAS.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '6-12 months',
          resources: ['MAS DPT Guidelines', 'PS Act'],
        },
      ],
      stablecoin: [
        {
          id: 'sg-mas-2',
          category: 'Recognition',
          title: 'Apply for Stablecoin Recognition',
          description: 'Apply for recognition as a regulated stablecoin issuer.',
          priority: 'high' as const,
          isRequired: true,
          estimatedTime: '4-8 months',
          resources: ['MAS Stablecoin Framework', 'Consultation Papers'],
        },
      ],
    },
  },
};

export const getComplianceChecklist = (
  region: string,
  assetType: string,
  scenario: string
): ChecklistItem[] => {
  const regionRules = complianceRules[region as keyof typeof complianceRules];
  if (!regionRules) return [];

  const assetRules = regionRules[assetType as keyof typeof regionRules];
  if (!assetRules) return [];

  const scenarioRules = assetRules[scenario as keyof typeof assetRules];
  if (!scenarioRules) return [];

  return scenarioRules;
};