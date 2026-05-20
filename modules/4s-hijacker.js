
// =====================================================================
// 6. ISO 27001:2022 COMPLIANCE AUDIT MODULE
// =====================================================================

window.FourS_Shield.generateISOAuditReport = async function() {
  const report = {
    metadata: {
      timestamp: new Date().toISOString(),
      standard: "ISO 27001:2022",
      auditor: "Ghost Auditor (Automated)",
      scope: "Dream OS Client-Side Security"
    },
    
    // A.5 - Information Security Policies
    policies: {
      hasPrivacyPolicy: !!document.querySelector('a[href*="privacy"]'),
      hasSecurityPolicy: !!document.querySelector('meta[name="security-policy"]'),
      score: 0
    },
    
    // A.8 - Asset Management
    assets: {
      totalScripts: document.scripts.length,
      thirdPartyScripts: Array.from(document.scripts).filter(s => 
        s.src && new URL(s.src).hostname !== location.hostname
      ).length,
      externalCDNs: [...new Set(Array.from(document.scripts)
        .map(s => {
          if(!s.src) return null;
          try { return new URL(s.src).hostname; } catch(e) { return null; }
        }).filter(Boolean))
      ],
      score: 0
    },
    
    // A.10 - Cryptographic Controls
    cryptography: {
      https: location.protocol === 'https:',
      hasHSTS: false,
      hasSRI: Array.from(document.querySelectorAll('script[integrity], link[integrity]')).length > 0,
      score: 0
    },
    
    // A.12 - Operational Security
    operational: {      errorCount: this.errorCount,
      hasErrorLogging: typeof window.onerror === 'function',
      hasAuditTrail: (localStorage.getItem('dream_os_4s_audit') || '[]').length > 2,
      score: 0
    },
    
    // A.14 - System Acquisition & Maintenance
    development: {
      hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      hasXFrameOptions: !!document.querySelector('meta[http-equiv="X-Frame-Options"]'),
      hasContentTypeOptions: !!document.querySelector('meta[http-equiv="X-Content-Type-Options"]'),
      score: 0
    },
    
    // A.16 - Incident Management
    incident: {
      hasIncidentLogging: this.logs.length > 0,
      hasAlertSystem: typeof this.alertSecurityEvent === 'function',
      meanTimeToDetect: 'N/A',
      score: 0
    }
  };
  
  // Calculate scores
  report.policies.score = (report.policies.hasPrivacyPolicy ? 50 : 0) + 
                          (report.policies.hasSecurityPolicy ? 50 : 0);
  
  report.assets.score = report.assets.thirdPartyScripts < 3 ? 100 :
                        report.assets.thirdPartyScripts < 6 ? 70 :
                        report.assets.thirdPartyScripts < 10 ? 50 : 20;
  
  report.cryptography.score = (report.cryptography.https ? 50 : 0) +
                              (report.cryptography.hasSRI ? 50 : 0);
  
  report.operational.score = (report.operational.errorCount === 0 ? 50 : 
                              report.operational.errorCount < 3 ? 30 : 10) +
                             (report.operational.hasErrorLogging ? 25 : 0) +
                             (report.operational.hasAuditTrail ? 25 : 0);
  
  report.development.score = (report.development.hasCSP ? 40 : 0) +
                             (report.development.hasXFrameOptions ? 30 : 0) +
                             (report.development.hasContentTypeOptions ? 30 : 0);
  
  report.incident.score = (report.incident.hasIncidentLogging ? 50 : 0) +
                          (report.incident.hasAlertSystem ? 50 : 0);
  
  // Overall compliance score
  const categories = Object.keys(report).filter(k => k !== 'metadata');
  const totalScore = categories.reduce((sum, cat) => sum + report[cat].score, 0) / categories.length;
    report.overallCompliance = {
    score: Math.round(totalScore),
    grade: totalScore >= 90 ? 'A' :
           totalScore >= 80 ? 'B' :
           totalScore >= 70 ? 'C' :
           totalScore >= 60 ? 'D' : 'F',
    status: totalScore >= 70 ? '✅ COMPLIANT' : '⚠️ NEEDS IMPROVEMENT'
  };
  
  return report;
};

// Add function to display ISO audit report
window.FourSUI.showISOAuditReport = async function() {
  const report = await FourS_Shield.generateISOAuditReport();
  
  const html = `
    <div style="padding: 20px; font-family: monospace;">
      <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
        🕌 ISO 27001:2022 COMPLIANCE AUDIT
      </h2>
      
      <div style="background: ${report.overallCompliance.score >= 70 ? '#d1fae5' : '#fef3c7'}; 
                  padding: 15px; border-radius: 8px; margin: 15px 0;">
        <div style="font-size: 24px; font-weight: bold; color: ${report.overallCompliance.score >= 70 ? '#065f46' : '#92400e'};">
          Overall Score: ${report.overallCompliance.score}/100 (Grade ${report.overallCompliance.grade})
        </div>
        <div style="margin-top: 5px; color: ${report.overallCompliance.score >= 70 ? '#065f46' : '#92400e'};">
          Status: ${report.overallCompliance.status}
        </div>
      </div>
      
      ${Object.entries(report).filter(([k]) => k !== 'metadata' && k !== 'overallCompliance').map(([category, data]) => `
        <div style="margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid ${data.score >= 70 ? '#10b981' : data.score >= 50 ? '#f59e0b' : '#ef4444'};">
          <h3 style="margin: 0 0 10px 0; color: #1e293b; text-transform: capitalize;">
            ${category.replace(/([A-Z])/g, ' $1').trim()} 
            <span style="float: right; color: ${data.score >= 70 ? '#10b981' : '#ef4444'};">${data.score}/100</span>
          </h3>
          ${Object.entries(data).filter(([k]) => k !== 'score').map(([key, value]) => `
            <div style="margin: 5px 0; font-size: 12px;">
              <span style="color: #64748b;">${key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span style="color: ${typeof value === 'boolean' ? (value ? '#10b981' : '#ef4444') : '#1e293b'}; margin-left: 5px;">
                ${typeof value === 'boolean' ? (value ? '✅' : '❌') : Array.isArray(value) ? value.length : value}
              </span>
            </div>
          `).join('')}
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px; font-size: 11px; color: #64748b;">        <strong> Recommendations:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${report.assets.thirdPartyScripts > 5 ? '<li>Reduce third-party scripts from ' + report.assets.thirdPartyScripts + ' to < 5</li>' : ''}
          ${!report.development.hasCSP ? '<li>Implement Content-Security-Policy header</li>' : ''}
          ${!report.cryptography.hasSRI ? '<li>Add Subresource Integrity (SRI) hashes for all external scripts</li>' : ''}
          ${report.operational.errorCount > 0 ? '<li>Investigate ' + report.operational.errorCount + ' errors detected</li>' : ''}
          ${report.overallCompliance.score < 70 ? '<li>Prioritize critical controls to achieve ISO 27001 compliance</li>' : ''}
          ${report.overallCompliance.score >= 70 ? '<li>✅ Good compliance! Continue monitoring</li>' : ''}
        </ul>
      </div>
      
      <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        Audit ID: ${'ISO-AUDIT-' + Date.now()} | Generated: ${new Date().toLocaleString('id-ID')} | 
        Standard: ISO 27001:2022 | Auditor: Ghost Auditor (Automated)
      </div>
    </div>
  `;
  
  // Show in modal
  const old = document.getElementById('fours-custom-modal'); 
  if(old) old.remove();
  
  const m = document.createElement('div'); 
  m.id = 'fours-custom-modal';
  m.className = 'fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 text-white';
  
  m.innerHTML = `
    <div style="background: #0f172a; border: 2px solid #10b981; border-radius: 16px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="padding: 20px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="color: #10b981; margin: 0;">🕌 ISO 27001 Compliance Audit</h3>
        <button onclick="document.getElementById('fours-custom-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      ${html}
      <div style="padding: 20px; border-top: 1px solid #1e293b; display: flex; gap: 10px;">
        <button onclick="window.print()" style="flex: 1; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🖨️ Print Report</button>
        <button onclick="document.getElementById('fours-custom-modal').remove()" style="flex: 1; padding: 12px; background: #64748b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(m);
};

console.log("✅ ISO 27001 Audit Module Loaded - Ready for compliance testing");
