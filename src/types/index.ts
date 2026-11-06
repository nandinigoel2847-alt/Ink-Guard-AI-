export type SeverityLevel = 'critical' | 'warning' | 'advisory';

export type RuleCategory = 
  | 'factual_claims'
  | 'voice_and_tone'
  | 'terminology'
  | 'visual_and_assets'
  | 'accessibility'
  | 'legal_and_compliance';

export type HumanReviewRequirement = 
  | 'none'
  | 'brand_lead_signoff'
  | 'legal_counsel_review'
  | 'subject_matter_expert';

export interface BrandRule {
  id: string;
  category: RuleCategory;
  name: string;
  description: string;
  ruleCode: string;
  sourceDocument: string;
  sourceSection: string;
  approvedCitation: string;
  severity: SeverityLevel;
  humanReviewRequired: HumanReviewRequirement;
  patternOrKeywords?: string[];
  suggestedFixTemplate?: string;
  isActive: boolean;
}

export interface BrandKit {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  primaryColor: string;
  accentColor: string;
  approvedFonts: string[];
  rules: BrandRule[];
  factSheet: {
    establishedYear: number;
    headquarters: string;
    verifiedClaims: string[];
    forbiddenClaims: string[];
    slaUptime: string;
    certifications: string[];
  };
  terminologyMap: { [forbidden: string]: string };
}

export interface EvidenceItem {
  id: string;
  flaggedText: string;
  startIndex: number;
  endIndex: number;
  category: RuleCategory;
  severity: SeverityLevel;
  reason: string;
  ruleCode: string;
  sourceDocument: string;
  sourceSection: string;
  approvedCitation: string;
  suggestedCorrection: string;
  humanReviewRequired: HumanReviewRequirement;
  isResolved: boolean;
  resolutionStatus?: 'applied' | 'dismissed' | 'pending';
  dismissRationale?: string;
}

export interface AuditResult {
  id: string;
  timestamp: string;
  channel: string;
  brandKitId: string;
  brandKitName: string;
  originalText: string;
  currentText: string;
  healthScore: number;
  evidenceItems: EvidenceItem[];
  summary: {
    totalFlagged: number;
    criticalCount: number;
    warningCount: number;
    advisoryCount: number;
    resolvedCount: number;
    requiresHumanReviewCount: number;
  };
  aiProvider: 'gemini-3.8-flash' | 'deterministic-guardian';
  signoff?: {
    signedBy: string;
    title: string;
    organization: string;
    signedAt: string;
    certificateHash: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
  };
}
