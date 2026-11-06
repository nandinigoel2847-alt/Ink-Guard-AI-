import { BrandKit, EvidenceItem } from '../types';

/**
 * Deterministic Brand Rule Evaluator
 * Runs high-precision regex & pattern evaluation against text content,
 * computing exact character indices and grounding each finding with
 * an authoritative evidence citation from the active brand kit.
 */
export function evaluateBrandRules(text: string, brandKit: BrandKit): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  let itemCounter = 1;

  if (!text || text.trim().length === 0) {
    return [];
  }

  // 1. Evaluate Terminology Mappings
  if (brandKit.terminologyMap) {
    for (const [forbiddenTerm, approvedTerm] of Object.entries(brandKit.terminologyMap)) {
      const escaped = forbiddenTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const flaggedText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + flaggedText.length;

        items.push({
          id: `ev-tm-${itemCounter++}`,
          flaggedText,
          startIndex,
          endIndex,
          category: 'terminology',
          severity: 'warning',
          reason: `Deprecated or unapproved brand terminology '${flaggedText}' detected.`,
          ruleCode: 'TM-301',
          sourceDocument: 'Trademark & Style Directory',
          sourceSection: 'Terminology Registry §2.1',
          approvedCitation: `Authoritative term is '${approvedTerm}'. Organization standards require consistent nomenclature across all published collaterals.`,
          suggestedCorrection: approvedTerm,
          humanReviewRequired: 'none',
          isResolved: false,
          resolutionStatus: 'pending'
        });
      }
    }
  }

  // 2. Evaluate Specific Active Rules from BrandKit
  for (const rule of brandKit.rules) {
    if (!rule.isActive || !rule.patternOrKeywords || rule.patternOrKeywords.length === 0) {
      continue;
    }

    for (const keyword of rule.patternOrKeywords) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const flaggedText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + flaggedText.length;

        // Check if we already have an overlap at this exact index
        const exists = items.some(it => 
          (startIndex >= it.startIndex && startIndex < it.endIndex) ||
          (endIndex > it.startIndex && endIndex <= it.endIndex)
        );

        if (!exists) {
          items.push({
            id: `ev-rule-${rule.id}-${itemCounter++}`,
            flaggedText,
            startIndex,
            endIndex,
            category: rule.category,
            severity: rule.severity,
            reason: rule.description,
            ruleCode: rule.ruleCode,
            sourceDocument: rule.sourceDocument,
            sourceSection: rule.sourceSection,
            approvedCitation: rule.approvedCitation,
            suggestedCorrection: rule.suggestedFixTemplate || 'approved phrasing required',
            humanReviewRequired: rule.humanReviewRequired,
            isResolved: false,
            resolutionStatus: 'pending'
          });
        }
      }
    }
  }

  // 3. Evaluate Fact Sheet Claims (e.g. established date, uptime, guarantees)
  if (brandKit.factSheet) {
    // Check for year discrepancies
    const yearMatches = text.match(/\b(19\d\d|20\d\d)\b/g);
    if (yearMatches) {
      for (const y of yearMatches) {
        const numY = parseInt(y, 10);
        if (numY < brandKit.factSheet.establishedYear && numY > 2000) {
          const idx = text.indexOf(y);
          if (idx !== -1) {
            items.push({
              id: `ev-year-${itemCounter++}`,
              flaggedText: y,
              startIndex: idx,
              endIndex: idx + y.length,
              category: 'factual_claims',
              severity: 'critical',
              reason: `Factual conflict: Content states or implies founding year ${y}, but verified corporate record indicates ${brandKit.factSheet.establishedYear}.`,
              ruleCode: 'FC-103',
              sourceDocument: 'Corporate Master Registry',
              sourceSection: 'Entity Incorporation Record §1.0',
              approvedCitation: `${brandKit.name} was established in ${brandKit.factSheet.establishedYear} (${brandKit.factSheet.headquarters}).`,
              suggestedCorrection: `${brandKit.factSheet.establishedYear}`,
              humanReviewRequired: 'brand_lead_signoff',
              isResolved: false,
              resolutionStatus: 'pending'
            });
          }
        }
      }
    }
  }

  // Sort items by startIndex
  items.sort((a, b) => a.startIndex - b.startIndex);

  return items;
}

/**
 * Calculates a comprehensive Brand Health Score (0 - 100) based on
 * violations, severity weights, and resolved items.
 */
export function calculateBrandHealthScore(evidenceItems: EvidenceItem[]): number {
  if (evidenceItems.length === 0) return 100;

  const totalPossibleDeduction = evidenceItems.reduce((acc, item) => {
    if (item.isResolved || item.resolutionStatus === 'applied') return acc;
    if (item.severity === 'critical') return acc + 25;
    if (item.severity === 'warning') return acc + 12;
    return acc + 5;
  }, 0);

  const score = Math.max(10, Math.min(100, Math.round(100 - totalPossibleDeduction)));
  return score;
}
