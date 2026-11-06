import { BrandKit } from '../types';

export const DEFAULT_BRAND_KITS: BrandKit[] = [
  {
    id: 'inkloom-master',
    name: 'Inkloom AI (Master Brand)',
    tagline: 'Catch the mistake. Show the evidence. Protect the brand.',
    industry: 'Enterprise AI & Governance Software',
    primaryColor: '#0F172A',
    accentColor: '#4F46E5',
    approvedFonts: ['Plus Jakarta Sans', 'DM Sans', 'JetBrains Mono'],
    factSheet: {
      establishedYear: 2023,
      headquarters: 'Ghaziabad / New Delhi NCR',
      verifiedClaims: [
        'SOC 2 Type II certified platform',
        'ISO 27001 data governance compliance',
        '99.9% measured platform availability (per SLA Schedule B)',
        'Evidence Trail patent-pending citation mapping engine',
        'Over 1.2M brand assets audited across enterprise deployments'
      ],
      forbiddenClaims: [
        '100% infallible AI or 100% bug-free guarantees',
        'Zero downtime guarantee (always qualify with 99.9% SLA)',
        'Unconditional legal liability indemnity for AI suggestions',
        'Founded prior to 2023'
      ],
      slaUptime: '99.9% uptime SLA with scheduled maintenance exclusion',
      certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'HIPAA Ready via BAA']
    },
    terminologyMap: {
      'inkloom bot': 'InkGuard AI Engine',
      'inkguard bot': 'InkGuard AI Engine',
      'magic ai': 'AI-assisted audit intelligence',
      'hallucination free': 'evidence-verified',
      'foolproof': 'robustly governed',
      'revolutionary': 'evidence-first',
      'game-changing': 'distinctive',
      'click here': 'Read the governance guide',
      'cheap': 'cost-efficient',
      'guaranteed profit': 'verifiable business value'
    },
    rules: [
      {
        id: 'rule-fc-01',
        category: 'factual_claims',
        name: 'Absolute Availability Claim Prohibition',
        description: 'Prohibits unqualified 100% uptime or zero downtime claims.',
        ruleCode: 'FC-101',
        sourceDocument: 'Inkloom Brand Governance Manual 2026',
        sourceSection: 'Section 4.1: Technical Claims & Availability',
        approvedCitation: '"All operational availability statements must cite the contractual 99.9% SLA (Schedule B). Absolute claims such as \'100% uptime\' or \'zero downtime\' are strictly forbidden due to regulatory and truth-in-advertising guidelines."',
        severity: 'critical',
        humanReviewRequired: 'legal_counsel_review',
        patternOrKeywords: ['100% uptime', 'zero downtime', 'never goes down', '100% available', 'zero latency'],
        suggestedFixTemplate: '99.9% SLA availability',
        isActive: true
      },
      {
        id: 'rule-fc-02',
        category: 'factual_claims',
        name: 'Unqualified AI Accuracy & Infallibility Claims',
        description: 'AI output must never be framed as infallible or completely error-free.',
        ruleCode: 'FC-102',
        sourceDocument: 'Inkloom AI Ethics & Transparency Standard v3.0',
        sourceSection: 'Section 2.4: Transparency & Safe Claims',
        approvedCitation: '"Promotional copy must never state that our AI models are \'100% accurate\', \'infallible\', or \'hallucination-free\'. Marketing copy must use \'evidence-backed\', \'human-supervised\', or \'empirically benchmarked\'."',
        severity: 'critical',
        humanReviewRequired: 'brand_lead_signoff',
        patternOrKeywords: ['100% accurate', 'infallible', 'hallucination free', 'zero mistakes', 'flawless ai', '100% bug-free'],
        suggestedFixTemplate: 'evidence-verified precision with human-in-the-loop oversight',
        isActive: true
      },
      {
        id: 'rule-vt-01',
        category: 'voice_and_tone',
        name: 'Banned Hyperbolic Adjectives & Tech Cliches',
        description: 'Prohibits generic AI hype words that diminish editorial authority.',
        ruleCode: 'VT-201',
        sourceDocument: 'Brand Voice Playbook: The Clear Authority Guide',
        sourceSection: 'Section 1.2: The Anti-Hype Lexicon',
        approvedCitation: '"Inkloom communicates with quiet authority, precision, and empirical facts. Avoid sensationalist buzzwords: \'revolutionary\', \'game-changing\', \'magic\', and \'unprecedented\'. Replace with concrete mechanisms."',
        severity: 'warning',
        humanReviewRequired: 'brand_lead_signoff',
        patternOrKeywords: ['revolutionary', 'game-changing', 'game changing', 'miracle', 'magic ai', 'unmatched powerhouse', 'supercharge your brand'],
        suggestedFixTemplate: 'systematic and evidence-verified',
        isActive: true
      },
      {
        id: 'rule-vt-02',
        category: 'voice_and_tone',
        name: 'Aggressive or Arrogant Pitch Framing',
        description: 'Discourages denigrating competitor solutions or aggressive condescending tone.',
        ruleCode: 'VT-202',
        sourceDocument: 'Brand Voice Playbook: Market Communication',
        sourceSection: 'Section 3.1: Competitive Integrity',
        approvedCitation: '"We never insult our prospects or demean alternative workflows as \'stupid\', \'archaic\', or \'hopeless\'. Frame existing challenges with empathy and offer structured solutions."',
        severity: 'advisory',
        humanReviewRequired: 'none',
        patternOrKeywords: ['only fools', 'archaic losers', 'stop being stupid', 'pathetic manual checks', 'inferior tools'],
        suggestedFixTemplate: 'traditional manual workflows',
        isActive: true
      },
      {
        id: 'rule-tm-01',
        category: 'terminology',
        name: 'Registered Product Nomenclature',
        description: 'Enforces correct capitalization and nomenclature for InkGuard AI and Inkloom AI.',
        ruleCode: 'TM-301',
        sourceDocument: 'Trademark & Style Directory 2026',
        sourceSection: 'Section 2.1: Brand & Sub-Brand Naming',
        approvedCitation: '"The platform brand is \'InkGuard AI\' (two words, CamelCase). Do not refer to it as \'inkguard\', \'InkGuard Bot\', or \'Ink Guard\'. The parent organization is \'Inkloom AI\'."',
        severity: 'warning',
        humanReviewRequired: 'none',
        patternOrKeywords: ['inkguard bot', 'ink guard', 'inkloom bot', 'Inkguard AI', 'INKGUARD'],
        suggestedFixTemplate: 'InkGuard AI',
        isActive: true
      },
      {
        id: 'rule-va-01',
        category: 'visual_and_assets',
        name: 'Unauthorized Color Palette References',
        description: 'Brand materials must adhere to the certified Navy Slate (#0F172A) and Indigo (#4F46E5) palette.',
        ruleCode: 'VA-401',
        sourceDocument: 'Design System Guidelines: Color Tokens',
        sourceSection: 'Section 5.3: Digital Application Palettes',
        approvedCitation: '"Our primary digital interface canvas is Deep Slate (#0F172A) with Accent Indigo (#4F46E5) and Emerald (#10B981) for verified statuses. Vibrant purples, neon yellows, and harsh magenta are off-brand."',
        severity: 'advisory',
        humanReviewRequired: 'brand_lead_signoff',
        patternOrKeywords: ['neon pink', 'cyberpunk purple', 'bright red banner', 'electric cyan'],
        suggestedFixTemplate: 'Inkloom Navy and Emerald verification accents',
        isActive: true
      },
      {
        id: 'rule-ac-01',
        category: 'accessibility',
        name: 'Vague Hyperlink Anchor Text (WCAG 2.1 AA)',
        description: 'Enforces descriptive link context instead of generic phrases like "click here".',
        ruleCode: 'AC-501',
        sourceDocument: 'Inkloom Digital Accessibility Standards',
        sourceSection: 'Section 2.4.4: Link Purpose in Context',
        approvedCitation: '"Links must explicitly describe the target destination to satisfy WCAG 2.1 Success Criterion 2.4.4. Never use ambiguous phrases such as \'click here\', \'read more\', or \'link\' in isolation."',
        severity: 'warning',
        humanReviewRequired: 'none',
        patternOrKeywords: ['click here', 'click this link', 'tap here', 'read more', 'learn more here'],
        suggestedFixTemplate: 'Explore the brand governance methodology',
        isActive: true
      },
      {
        id: 'rule-lc-01',
        category: 'legal_and_compliance',
        name: 'Mandatory AI Content Generation Disclosure',
        description: 'EU AI Act and FTC compliance requires clear disclosure of AI-assisted outputs.',
        ruleCode: 'LC-601',
        sourceDocument: 'Global Regulatory & Governance Protocol',
        sourceSection: 'Section 7.2: Synthetic Content Transparency',
        approvedCitation: '"Public content co-authored or audited using machine learning pipelines must maintain traceable human governance and, where mandated by regional regulators (EU AI Act Title IV), include standard transparency annotations."',
        severity: 'critical',
        humanReviewRequired: 'legal_counsel_review',
        patternOrKeywords: ['completely autonomous human replacement', 'no human oversight needed', 'purely synthetic undisclosed', 'bypass legal signoff'],
        suggestedFixTemplate: 'governed through human-in-the-loop review',
        isActive: true
      }
    ]
  },
  {
    id: 'aura-healthtech',
    name: 'Aura HealthTech Enterprise',
    tagline: 'Clinical precision in patient-first communication.',
    industry: 'Healthcare Technology & Telehealth',
    primaryColor: '#0C4A6E',
    accentColor: '#0284C7',
    approvedFonts: ['Plus Jakarta Sans', 'DM Sans'],
    factSheet: {
      establishedYear: 2020,
      headquarters: 'Boston, MA',
      verifiedClaims: [
        'HIPAA compliant cloud infrastructure',
        'FDA 510(k) clearance for AuraDiagnostic Core v2',
        'Over 450,000 verified telehealth consultations'
      ],
      forbiddenClaims: [
        'Guaranteed diagnosis without licensed clinician review',
        '100% cure rate or medicinal certainty'
      ],
      slaUptime: '99.95% clinical system availability',
      certifications: ['HIPAA', 'SOC 2 Type II', 'FDA 510(k)']
    },
    terminologyMap: {
      'cures patient': 'supports clinical management',
      'replaces doctor': 'assists licensed physicians',
      'instant diagnosis': 'preliminary algorithmic triage'
    },
    rules: [
      {
        id: 'rule-aura-01',
        category: 'legal_and_compliance',
        name: 'Medical Advice Disclaimer Requirement',
        description: 'Prohibits claims that software provides medical diagnosis without clinician oversight.',
        ruleCode: 'AURA-MED-01',
        sourceDocument: 'Aura Health Compliance Manual',
        sourceSection: 'Section 1.1: Medical Device & Advice Disclaimers',
        approvedCitation: '"All patient-facing materials must state: \'Aura HealthTech is a clinical decision support tool and does not provide direct medical diagnoses.\'"',
        severity: 'critical',
        humanReviewRequired: 'legal_counsel_review',
        patternOrKeywords: ['diagnoses your disease', 'cures your condition', 'no doctor needed', '100% medical cure'],
        suggestedFixTemplate: 'clinical triage support under physician supervision',
        isActive: true
      }
    ]
  },
  {
    id: 'apex-fintech',
    name: 'Apex Global FinTech',
    tagline: 'Transparent capital intelligence and verified settlement.',
    industry: 'Financial Services & Investment Tech',
    primaryColor: '#052E16',
    accentColor: '#16A34A',
    approvedFonts: ['Plus Jakarta Sans', 'JetBrains Mono'],
    factSheet: {
      establishedYear: 2019,
      headquarters: 'London / New York',
      verifiedClaims: [
        'FCA and SEC regulated custodial integrations',
        '256-bit institutional encryption',
        'Over $8.4B in annual transaction volume audited'
      ],
      forbiddenClaims: [
        'Guaranteed investment returns or risk-free yields',
        'Beat the market with 100% certainty'
      ],
      slaUptime: '99.99% high-frequency trade pipeline SLA',
      certifications: ['FCA Authorized', 'SEC Registered', 'PCI-DSS Level 1']
    },
    terminologyMap: {
      'guaranteed return': 'target historic performance indicator',
      'risk-free profit': 'hedged yield profile',
      'zero loss': 'risk-managed allocation'
    },
    rules: [
      {
        id: 'rule-apex-01',
        category: 'legal_and_compliance',
        name: 'SEC / FTC Disclaimers on Capital Projections',
        description: 'Prohibits guaranteed return claims without risk disclosure.',
        ruleCode: 'APEX-SEC-01',
        sourceDocument: 'Apex Financial Compliance Protocol §9',
        sourceSection: 'Section 9.4: Yield & Performance Representation',
        approvedCitation: '"Past performance is no guarantee of future results. All yield models must state risk warnings and regulatory disclaimers explicitly."',
        severity: 'critical',
        humanReviewRequired: 'legal_counsel_review',
        patternOrKeywords: ['guaranteed profit', 'zero risk', 'guaranteed 20% return', 'can never lose money'],
        suggestedFixTemplate: 'projected yield based on historical modeling (capital at risk)',
        isActive: true
      }
    ]
  }
];

export const SAMPLE_DRAFTS = [
  {
    id: 'sample-pr-high-risk',
    title: 'High-Risk Product Launch Press Release',
    channel: 'Press Release / Wire',
    brandKitId: 'inkloom-master',
    description: 'Contains absolute uptime claims, banned hype adjectives, unqualified AI promises, and vague links.',
    text: `Inkloom AI is proud to announce our revolutionary new release: InkGuard Bot! This game-changing breakthrough guarantees 100% uptime with zero downtime forever, ensuring your enterprise communications are 100% bug-free and completely error-free.

Unlike inferior tools and pathetic manual checks used by archaic losers, our magic ai is 100% accurate and completely hallucination free. There is no human oversight needed because the system is infallible.

Furthermore, we provide an unmatched powerhouse solution that supercharges your brand with guaranteed profit. Want to see how it works? Just click here to read our full technical whitepaper and install the update today.`
  },
  {
    id: 'sample-social-campaign',
    title: 'Social Media & Influencer Campaign Copy',
    channel: 'LinkedIn / Social Media',
    brandKitId: 'inkloom-master',
    description: 'Tone mismatch with brand voice, unauthorized colors, unregistered trademark casing, and informal slurs.',
    text: `Say goodbye to stupid mistakes! INKGUARD is the miracle tool that delivers zero latency brand protection. Our platform never goes down and offers 100% accurate sentiment analysis. 

Make sure your graphics use our hot new neon pink and cyberpunk purple theme! Don't let your competitors fool you with archaic workflows. Tap here to upgrade now.`
  },
  {
    id: 'sample-compliant-statement',
    title: 'Governed & Verified Executive Release',
    channel: 'Executive Communication',
    brandKitId: 'inkloom-master',
    description: 'Demonstrates a properly vetted, compliant statement adhering to InkGuard guidelines.',
    text: `Inkloom AI today announced the general availability of InkGuard AI, an evidence-first brand governance platform designed for high-integrity enterprise communications. 

Operating under our 99.9% SLA availability commitment and backed by SOC 2 Type II certification, InkGuard AI pairs machine-assisted scanning with human-in-the-loop oversight to ensure claims are substantiated against verified company guidelines. 

Explore the brand governance methodology to review our compliance benchmarks.`
  }
];
