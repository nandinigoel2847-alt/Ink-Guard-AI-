import { AuditResult, BrandKit, BrandRule, EvidenceItem } from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getBrandKits(): Promise<{ activeKitId: string; kits: BrandKit[] }> {
    const res = await fetch('/api/brand-kits');
    return res.json();
  },

  async setActiveBrandKit(id: string): Promise<{ success: boolean; activeKitId: string }> {
    const res = await fetch('/api/brand-kits/active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.json();
  },

  async getGuidelines(brandKitId?: string): Promise<{
    brandKitId: string;
    brandKitName: string;
    rules: BrandRule[];
    factSheet: any;
    terminologyMap: Record<string, string>;
  }> {
    const query = brandKitId ? `?brandKitId=${encodeURIComponent(brandKitId)}` : '';
    const res = await fetch(`/api/guidelines${query}`);
    return res.json();
  },

  async addRule(brandKitId: string, rule: Partial<BrandRule>): Promise<{ success: boolean; rule: BrandRule }> {
    const res = await fetch('/api/guidelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandKitId, rule })
    });
    return res.json();
  },

  async deleteRule(id: string, brandKitId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/guidelines/${id}?brandKitId=${encodeURIComponent(brandKitId)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async analyzeDraft(params: {
    content: string;
    channel?: string;
    brandKitId?: string;
    strictness?: 'standard' | 'high';
  }): Promise<AuditResult> {
    const res = await fetch('/api/audit/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || 'Server audit error');
    }
    return res.json();
  },

  async fixAllDraft(params: {
    originalText: string;
    itemsToApply: EvidenceItem[];
    brandKitId: string;
  }): Promise<{ correctedText: string; appliedCount: number }> {
    const res = await fetch('/api/audit/fix-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async getHistory(): Promise<AuditResult[]> {
    const res = await fetch('/api/history');
    return res.json();
  },

  async saveAuditResult(result: AuditResult): Promise<{ success: boolean; record: AuditResult }> {
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    return res.json();
  },

  async signoffAudit(id: string, payload: {
    signedBy: string;
    title: string;
    notes?: string;
    status?: 'approved' | 'rejected';
  }): Promise<{ success: boolean; record: AuditResult }> {
    const res = await fetch(`/api/history/${id}/signoff`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getStats() {
    const res = await fetch('/api/stats');
    return res.json();
  }
};
