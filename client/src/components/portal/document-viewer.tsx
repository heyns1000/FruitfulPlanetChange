import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Download, 
  Shield,
  FileText,
  Clock,
  User,
  ExternalLink
} from "lucide-react"

interface DocumentViewerProps {
  document: {
    id: string | number
    title: string
    type?: string
    category: string
    description: string
    lastUpdated?: string
    author?: string
    status?: string
    size?: string
    priority?: "high" | "medium" | "low"
    url?: string
    icon?: string
    tags?: string[]
    createdAt?: string
  }
  onBack: () => void
}

export function DocumentViewer({ document, onBack }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Helper functions to get document details
  const getDocumentType = (id: string | number) => {
    const types: Record<string, string> = {
      '1': 'PDF',
      'fruitful-holdings-nda': 'PDF',
      '2': 'HTML',
      'securesign-portal': 'HTML',
      '3': 'HTML',
      'seedwave-deployment': 'HTML',
      '4': 'HTML',
      'faa-zone-minutes': 'HTML',
      '5': 'HTML',
      'firebase-integration': 'HTML',
      '6': 'HTML',
      'paypal-setup': 'HTML',
      '7': 'HTML',
      'repository-index': 'HTML',
      '8': 'HTML',
      'codenest-settings': 'HTML'
    }
    return types[String(id)] || 'HTML'
  }

  const getDocumentPriority = (id: string | number): "high" | "medium" | "low" => {
    const priorities: Record<string, "high" | "medium" | "low"> = {
      '1': 'high',
      'fruitful-holdings-nda': 'high',
      '2': 'high',
      'securesign-portal': 'high',
      '3': 'high',
      'seedwave-deployment': 'high',
      '4': 'medium',
      'faa-zone-minutes': 'medium',
      '5': 'medium',
      'firebase-integration': 'medium',
      '6': 'medium',
      'paypal-setup': 'medium',
      '7': 'high',
      'repository-index': 'high',
      '8': 'low',
      'codenest-settings': 'low'
    }
    return priorities[String(id)] || 'medium'
  }

  const getDocumentSize = (id: string | number) => {
    const sizes: Record<string, string> = {
      '1': '1.7 MB',
      'fruitful-holdings-nda': '1.7 MB',
      '2': '101 KB',
      'securesign-portal': '101 KB',
      '3': '67 KB',
      'seedwave-deployment': '67 KB',
      '4': '33 KB',
      'faa-zone-minutes': '33 KB',
      '5': '22 KB',
      'firebase-integration': '22 KB',
      '6': '23 KB',
      'paypal-setup': '23 KB',
      '7': '126 KB',
      'repository-index': '126 KB',
      '8': '45 KB',
      'codenest-settings': '45 KB'
    }
    return sizes[String(id)] || '50 KB'
  }

  const getDocumentAuthor = (id: string | number) => {
    const authors: Record<string, string> = {
      '1': 'Legal Team',
      'fruitful-holdings-nda': 'Legal Team',
      '2': 'Development Team',
      'securesign-portal': 'Development Team',
      '3': 'Operations Team',
      'seedwave-deployment': 'Operations Team',
      '4': 'Project Management',
      'faa-zone-minutes': 'Project Management',
      '5': 'Development Team',
      'firebase-integration': 'Development Team',
      '6': 'Payment Team',
      'paypal-setup': 'Payment Team',
      '7': 'Legal Team',
      'repository-index': 'Legal Team',
      '8': 'Development Team',
      'codenest-settings': 'Development Team'
    }
    return authors[String(id)] || 'VaultMesh™ Team'
  }

  // Get document content based on ID
  const getDocumentContent = () => {
    const documentContent: Record<string, string> = {
      'fruitful-holdings-nda': `
        <div class="document-content">
          <h1>Fruitful Holdings NDA</h1>
          <p><strong>Effective Date:</strong> July 19, 2025</p>
          <p><strong>Parties:</strong> Fruitful Holdings and Contracting Party</p>
          
          <h2>1. Purpose</h2>
          <p>This Non-Disclosure Agreement ("Agreement") is entered into to protect confidential information shared between parties in relation to Fruitful Holdings operations, including but not limited to:</p>
          <ul>
            <li>VaultMesh™ infrastructure details</li>
            <li>Seedwave™ portal specifications</li>
            <li>Brand ecosystem data (6,005+ brand elements)</li>
            <li>Legal documentation systems</li>
            <li>API integration credentials</li>
            <li>SecureSign™ VIP methodologies</li>
          </ul>

          <h2>2. Confidential Information</h2>
          <p>All information disclosed under this agreement shall be considered confidential, including technical specifications, business strategies, and operational procedures relating to the comprehensive brand management portal.</p>

          <h2>3. VaultMesh™ Security Requirements</h2>
          <p>Access to VaultMesh™ infrastructure requires:</p>
          <ul>
            <li>Signed NDA and security clearance verification</li>
            <li>Multi-factor authentication compliance</li>
            <li>Regular security training completion</li>
            <li>Audit log monitoring acceptance</li>
            <li>SecureSign™ digital signature enrollment</li>
          </ul>

          <h2>4. Obligations</h2>
          <p>The receiving party agrees to:</p>
          <ul>
            <li>Maintain strict confidentiality of all brand ecosystem data</li>
            <li>Use information solely for authorized business purposes</li>
            <li>Implement appropriate technical safeguards</li>
            <li>Return or destroy confidential materials upon request</li>
            <li>Report any security incidents immediately</li>
          </ul>

          <h2>5. Term and Enforcement</h2>
          <p>This agreement remains in effect for the duration of the business relationship and continues for 5 years following termination. Violations may result in immediate access revocation and legal action.</p>

          <div class="signature-section">
            <h3>Digital Signatures</h3>
            <p><strong>Document Status:</strong> Digitally signed through SecureSign™ VIP portal</p>
            <p><strong>Verification:</strong> Blockchain-verified with audit trail</p>
            <p><strong>Legal Binding:</strong> This is a legally enforceable agreement under applicable jurisdiction</p>
          </div>
        </div>
      `,
      '1': `
        <div class="document-content">
          <h1>Fruitful Holdings NDA</h1>
          <p><strong>Effective Date:</strong> July 19, 2025</p>
          <p><strong>Parties:</strong> Fruitful Holdings and Contracting Party</p>
          
          <h2>1. Purpose</h2>
          <p>This Non-Disclosure Agreement ("Agreement") is entered into to protect confidential information shared between parties in relation to Fruitful Holdings operations, including but not limited to:</p>
          <ul>
            <li>VaultMesh™ infrastructure details</li>
            <li>Seedwave™ portal specifications</li>
            <li>Brand ecosystem data (6,005+ brand elements)</li>
            <li>Legal documentation systems</li>
            <li>API integration credentials</li>
            <li>SecureSign™ VIP methodologies</li>
          </ul>

          <h2>2. Confidential Information</h2>
          <p>All information disclosed under this agreement shall be considered confidential, including technical specifications, business strategies, and operational procedures relating to the comprehensive brand management portal.</p>

          <h2>3. VaultMesh™ Security Requirements</h2>
          <p>Access to VaultMesh™ infrastructure requires:</p>
          <ul>
            <li>Signed NDA and security clearance verification</li>
            <li>Multi-factor authentication compliance</li>
            <li>Regular security training completion</li>
            <li>Audit log monitoring acceptance</li>
            <li>SecureSign™ digital signature enrollment</li>
          </ul>

          <h2>4. Obligations</h2>
          <p>The receiving party agrees to:</p>
          <ul>
            <li>Maintain strict confidentiality of all brand ecosystem data</li>
            <li>Use information solely for authorized business purposes</li>
            <li>Implement appropriate technical safeguards</li>
            <li>Return or destroy confidential materials upon request</li>
            <li>Report any security incidents immediately</li>
          </ul>

          <h2>5. Term and Enforcement</h2>
          <p>This agreement remains in effect for the duration of the business relationship and continues for 5 years following termination. Violations may result in immediate access revocation and legal action.</p>

          <div class="signature-section">
            <h3>Digital Signatures</h3>
            <p><strong>Document Status:</strong> Digitally signed through SecureSign™ VIP portal</p>
            <p><strong>Verification:</strong> Blockchain-verified with audit trail</p>
            <p><strong>Legal Binding:</strong> This is a legally enforceable agreement under applicable jurisdiction</p>
          </div>
        </div>
      `,
      'securesign-portal': `
        <div class="document-content">
          <h1>SecureSign™ Portal Documentation</h1>
          <p><strong>Version:</strong> 2.1.0 | <strong>Last Updated:</strong> July 19, 2025</p>
          
          <h2>Overview</h2>
          <p>SecureSign™ Portal provides enterprise-grade digital signature and document management capabilities integrated with the VaultMesh™ infrastructure.</p>

          <h2>Key Features</h2>
          <ul>
            <li><strong>Digital Signatures:</strong> Legally binding electronic signatures</li>
            <li><strong>Document Security:</strong> End-to-end encryption and tamper-proof storage</li>
            <li><strong>Audit Trail:</strong> Complete tracking of document lifecycle</li>
            <li><strong>VaultMesh™ Integration:</strong> Seamless connection to ecosystem protocols</li>
          </ul>

          <h2>Setup Instructions</h2>
          <ol>
            <li>Configure VaultMesh™ connection parameters</li>
            <li>Set up authentication protocols</li>
            <li>Initialize document templates</li>
            <li>Configure signature workflows</li>
          </ol>

          <h2>API Endpoints</h2>
          <pre><code>
POST /api/securesign/create
GET /api/securesign/documents/:id
PUT /api/securesign/sign/:id
DELETE /api/securesign/revoke/:id
          </code></pre>

          <p><strong>Status:</strong> Production Ready | <strong>Security Level:</strong> Enterprise+</p>
        </div>
      `,
      'seedwave-deployment': `
        <div class="document-content">
          <h1>Seedwave™ Deployment Manual</h1>
          <p><strong>Deployment Guide</strong> | <strong>Version:</strong> 3.0.1</p>
          
          <h2>Prerequisites</h2>
          <ul>
            <li>VaultMesh™ infrastructure access</li>
            <li>PostgreSQL database setup</li>
            <li>Node.js 18+ environment</li>
            <li>SecureSign™ VIP credentials</li>
          </ul>
          
          <h2>Deployment Steps</h2>
          <ol>
            <li><strong>Environment Setup:</strong> Configure environment variables</li>
            <li><strong>Database Migration:</strong> Run Drizzle schema push</li>
            <li><strong>Legal Document Seeding:</strong> Initialize legal documentation system</li>
            <li><strong>API Integration:</strong> Configure PayPal, Firebase, Spotify, Xero APIs</li>
            <li><strong>Security Configuration:</strong> Enable SecureSign™ VIP portal</li>
            <li><strong>Brand Data Sync:</strong> Load 6,005+ brand ecosystem elements</li>
          </ol>
          
          <h2>Production Configuration</h2>
          <pre><code>
NODE_ENV=production
DATABASE_URL=postgresql://[credentials]
PAYPAL_CLIENT_ID=[secure]
FIREBASE_API_KEY=[secure]
SPOTIFY_CLIENT_ID=[secure]
XERO_CLIENT_ID=[secure]
          </code></pre>
          
          <h2>Monitoring & Maintenance</h2>
          <ul>
            <li>24/7 real-time synchronization active</li>
            <li>Auto-refresh every 5 seconds for legal documents</li>
            <li>Health monitoring for all integrated services</li>
            <li>Audit trail logging for compliance</li>
          </ul>
        </div>
      `,
      'faa-zone-minutes': `
        <div class="document-content">
          <h1>FAA Zone Meeting Minutes</h1>
          <p><strong>Meeting Date:</strong> July 19, 2025 | <strong>Status:</strong> Archived</p>
          
          <h2>Meeting Overview</h2>
          <p>Minutes of meeting for FAA zone integration and setup within the VaultMesh™ ecosystem infrastructure.</p>
          
          <h2>Attendees</h2>
          <ul>
            <li>Project Management Team</li>
            <li>VaultMesh™ Technical Lead</li>
            <li>Legal Documentation Specialist</li>
            <li>Integration Manager</li>
          </ul>
          
          <h2>Agenda Items</h2>
          <ol>
            <li><strong>FAA Zone Integration Requirements</strong>
              <ul>
                <li>Compliance standards review</li>
                <li>Security protocol alignment</li>
                <li>Documentation requirements</li>
              </ul>
            </li>
            <li><strong>VaultMesh™ Infrastructure Setup</strong>
              <ul>
                <li>Portal configuration parameters</li>
                <li>Brand ecosystem integration</li>
                <li>Legal documentation synchronization</li>
              </ul>
            </li>
            <li><strong>Timeline and Deliverables</strong>
              <ul>
                <li>Implementation phases defined</li>
                <li>Testing protocols established</li>
                <li>Go-live criteria confirmed</li>
              </ul>
            </li>
          </ol>
          
          <h2>Action Items</h2>
          <ul>
            <li>Complete FAA zone compliance documentation</li>
            <li>Configure VaultMesh™ security protocols</li>
            <li>Implement real-time synchronization</li>
            <li>Schedule follow-up integration testing</li>
          </ul>
          
          <h2>Next Steps</h2>
          <p>Integration successfully completed and archived. All requirements met for VaultMesh™ ecosystem deployment.</p>
        </div>
      `,
      '2': `
        <div class="document-content">
          <h1>SecureSign™ Portal Documentation</h1>
          <p><strong>Version:</strong> 2.1.0 | <strong>Last Updated:</strong> July 19, 2025</p>
          
          <h2>Overview</h2>
          <p>SecureSign™ Portal provides enterprise-grade digital signature and document management capabilities integrated with the VaultMesh™ infrastructure.</p>

          <h2>Key Features</h2>
          <ul>
            <li><strong>Digital Signatures:</strong> Legally binding electronic signatures</li>
            <li><strong>Document Security:</strong> End-to-end encryption and tamper-proof storage</li>
            <li><strong>Audit Trail:</strong> Complete tracking of document lifecycle</li>
            <li><strong>VaultMesh™ Integration:</strong> Seamless connection to ecosystem protocols</li>
          </ul>

          <h2>Setup Instructions</h2>
          <ol>
            <li>Configure VaultMesh™ connection parameters</li>
            <li>Set up authentication protocols</li>
            <li>Initialize document templates</li>
            <li>Configure signature workflows</li>
          </ol>

          <h2>API Endpoints</h2>
          <pre><code>
POST /api/securesign/create
GET /api/securesign/documents/:id
PUT /api/securesign/sign/:id
DELETE /api/securesign/revoke/:id
          </code></pre>

          <p><strong>Status:</strong> Production Ready | <strong>Security Level:</strong> Enterprise+</p>
        </div>
      `,
      '3': `
        <div class="document-content">
          <h1>Seedwave™ Deployment Manual</h1>
          <p><strong>Deployment Guide</strong> | <strong>Version:</strong> 3.0.1</p>
          
          <h2>Prerequisites</h2>
          <ul>
            <li>VaultMesh™ infrastructure access</li>
            <li>PostgreSQL database setup</li>
            <li>Node.js 18+ environment</li>
            <li>SecureSign™ VIP credentials</li>
          </ul>
          
          <h2>Deployment Steps</h2>
          <ol>
            <li><strong>Environment Setup:</strong> Configure environment variables</li>
            <li><strong>Database Migration:</strong> Run Drizzle schema push</li>
            <li><strong>Legal Document Seeding:</strong> Initialize legal documentation system</li>
            <li><strong>API Integration:</strong> Configure PayPal, Firebase, Spotify, Xero APIs</li>
            <li><strong>Security Configuration:</strong> Enable SecureSign™ VIP portal</li>
            <li><strong>Brand Data Sync:</strong> Load 6,005+ brand ecosystem elements</li>
          </ol>
          
          <h2>Production Configuration</h2>
          <pre><code>
NODE_ENV=production
DATABASE_URL=postgresql://[credentials]
PAYPAL_CLIENT_ID=[secure]
FIREBASE_API_KEY=[secure]
SPOTIFY_CLIENT_ID=[secure]
XERO_CLIENT_ID=[secure]
          </code></pre>
          
          <h2>Monitoring & Maintenance</h2>
          <ul>
            <li>24/7 real-time synchronization active</li>
            <li>Auto-refresh every 5 seconds for legal documents</li>
            <li>Health monitoring for all integrated services</li>
            <li>Audit trail logging for compliance</li>
          </ul>
        </div>
      `,
      '4': `
        <div class="document-content">
          <h1>FAA Zone Meeting Minutes</h1>
          <p><strong>Meeting Date:</strong> July 19, 2025 | <strong>Status:</strong> Archived</p>
          
          <h2>Meeting Overview</h2>
          <p>Minutes of meeting for FAA zone integration and setup within the VaultMesh™ ecosystem infrastructure.</p>
          
          <h2>Attendees</h2>
          <ul>
            <li>Project Management Team</li>
            <li>VaultMesh™ Technical Lead</li>
            <li>Legal Documentation Specialist</li>
            <li>Integration Manager</li>
          </ul>
          
          <h2>Agenda Items</h2>
          <ol>
            <li><strong>FAA Zone Integration Requirements</strong>
              <ul>
                <li>Compliance standards review</li>
                <li>Security protocol alignment</li>
                <li>Documentation requirements</li>
              </ul>
            </li>
            <li><strong>VaultMesh™ Infrastructure Setup</strong>
              <ul>
                <li>Portal configuration parameters</li>
                <li>Brand ecosystem integration</li>
                <li>Legal documentation synchronization</li>
              </ul>
            </li>
            <li><strong>Timeline and Deliverables</strong>
              <ul>
                <li>Implementation phases defined</li>
                <li>Testing protocols established</li>
                <li>Go-live criteria confirmed</li>
              </ul>
            </li>
          </ol>
          
          <h2>Action Items</h2>
          <ul>
            <li>Complete FAA zone compliance documentation</li>
            <li>Configure VaultMesh™ security protocols</li>
            <li>Implement real-time synchronization</li>
            <li>Schedule follow-up integration testing</li>
          </ul>
          
          <h2>Next Steps</h2>
          <p>Integration successfully completed and archived. All requirements met for VaultMesh™ ecosystem deployment.</p>
        </div>
      `
    }

    // Use the detailed content from documentContent mapping first
    const contentKey = String(document.id);
    const detailedContent = documentContent[contentKey] || documentContent[document.title?.toLowerCase().replace(/[^a-z0-9]/g, '-')];
    
    if (detailedContent) {
      return detailedContent;
    }

    // Generate meaningful content based on document information
    return `
      <div class="document-content">
        <h1>${document.title}</h1>
        <p class="lead">${document.description}</p>
        
        <h2>Document Overview</h2>
        <p>This document is part of the VaultMesh™ legal documentation system and provides comprehensive information for ${document.category} purposes.</p>
        
        <div class="document-details">
          <h3>Document Specifications</h3>
          <ul>
            <li><strong>Type:</strong> ${getDocumentType(document.id)}</li>
            <li><strong>Status:</strong> ${getDocumentStatus(document.id)}</li>
            <li><strong>Priority:</strong> ${getDocumentPriority(document.id)}</li>
            <li><strong>Size:</strong> ${getDocumentSize(document.id)}</li>
            <li><strong>Author:</strong> ${getDocumentAuthor(document.id)}</li>
          </ul>
        </div>
        
        <h2>VaultMesh™ Integration</h2>
        <p>This document is integrated with the VaultMesh™ infrastructure ensuring secure access, audit trails, and compliance with enterprise security standards.</p>
        
        <h2>Legal Compliance</h2>
        <p>All documentation follows enterprise compliance standards and regulatory requirements for the Fruitful Holdings ecosystem.</p>
      </div>
    `;
  };
            <li><strong>FAA Zone Integration Status</strong>
              <p>Reviewed current integration progress with federal aviation protocols and compliance requirements.</p>
            </li>
            <li><strong>Technical Architecture</strong>
              <p>Discussed VaultMesh™ connectivity and data synchronization requirements for aviation sector compliance.</p>
            </li>
            <li><strong>Security Protocols</strong>
              <p>Established enhanced security measures for aviation-related data handling and storage.</p>
            </li>
          </ol>

          <h2>Action Items</h2>
          <ul>
            <li>Complete federal compliance documentation</li>
            <li>Implement additional security layers</li>
            <li>Schedule follow-up technical review</li>
          </ul>

          <h2>Next Meeting</h2>
          <p>Scheduled for Q3 2025 pending federal review completion.</p>
        </div>
      `,
      'firebase-integration': `
        <div class="document-content">
          <h1>Firebase Core Minutes</h1>
          <p><strong>Integration Meeting</strong> | <strong>Date:</strong> July 19, 2025</p>
          
          <h2>Meeting Purpose</h2>
          <p>Technical discussion regarding Firebase integration with VaultMesh™ infrastructure and Seedwave™ portal backend services.</p>

          <h2>Technical Decisions</h2>
          <ol>
            <li><strong>Authentication Strategy</strong>
              <p>Implement Firebase Auth as secondary authentication layer while maintaining primary VaultMesh™ security protocols.</p>
            </li>
            <li><strong>Real-time Database</strong>
              <p>Use Firebase Realtime Database for live metrics and status updates across the ecosystem.</p>
            </li>
            <li><strong>Cloud Functions</strong>
              <p>Deploy serverless functions for automated document processing and notification systems.</p>
            </li>
          </ol>

          <h2>Implementation Plan</h2>
          <ul>
            <li>Phase 1: Authentication integration</li>
            <li>Phase 2: Real-time data sync</li>
            <li>Phase 3: Serverless function deployment</li>
          </ul>

          <h2>Security Considerations</h2>
          <p>All Firebase integrations must maintain VaultMesh™ security standards and comply with enterprise-grade encryption requirements.</p>
        </div>
      `,
      'paypal-setup': `
        <div class="document-content">
          <h1>PayPal Integration Guide</h1>
          <p><strong>Payment System Setup</strong> | <strong>Version:</strong> 1.2.0</p>
          
          <h2>Overview</h2>
          <p>Complete setup guide for PayPal payment processing integration within the VaultMesh™ ecosystem and Seedwave™ portal.</p>

          <h2>API Configuration</h2>
          <pre><code>
// PayPal SDK Configuration
const paypal = require('@paypal/checkout-server-sdk');
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
          </code></pre>

          <h2>Integration Steps</h2>
          <ol>
            <li>Create PayPal developer account</li>
            <li>Generate API credentials</li>
            <li>Configure webhook endpoints</li>
            <li>Implement payment processing</li>
            <li>Set up subscription management</li>
          </ol>

          <h2>VaultMesh™ Packages</h2>
          <ul>
            <li><strong>Starter:</strong> $99/month - Basic VaultMesh™ access</li>
            <li><strong>Professional:</strong> $299/month - Full ecosystem integration</li>
            <li><strong>Enterprise:</strong> $799/month - Complete infrastructure access</li>
          </ul>

          <h2>Security</h2>
          <p>All payment data is encrypted and processed through PayPal's secure infrastructure, maintaining PCI compliance standards.</p>
        </div>
      `,
      'repository-index': `
        <div class="document-content">
          <h1>Repository & Legal Hub Index</h1>
          <p><strong>Main Index</strong> | <strong>Legal Documentation System</strong></p>
          
          <h2>Document Categories</h2>
          <ul>
            <li><strong>Contracts & NDAs</strong> - Legal agreements and non-disclosure documents</li>
            <li><strong>Technical Documentation</strong> - Setup guides, API documentation, deployment manuals</li>
            <li><strong>Meeting Minutes</strong> - Project meetings, technical discussions, compliance reviews</li>
            <li><strong>Integration Guides</strong> - Third-party service integration documentation</li>
          </ul>

          <h2>Repository Structure</h2>
          <pre><code>
legal-main/
├── public/
│   ├── contracts/
│   ├── technical/
│   ├── minutes/
│   └── respitories/
└── templates/
            </code></pre>

          <h2>Access Control</h2>
          <p>All documents are secured through VaultMesh™ infrastructure with role-based access controls and audit logging.</p>

          <h2>Document Lifecycle</h2>
          <ol>
            <li>Creation and initial review</li>
            <li>Approval workflow</li>
            <li>Publication and distribution</li>
            <li>Version control and updates</li>
            <li>Archival and retention</li>
          </ol>

          <h2>Compliance</h2>
          <p>All legal documentation follows enterprise compliance standards and regulatory requirements.</p>
        </div>
      `,
      'codenest-settings': `
        <div class="document-content">
          <h1>CodeNest Settings & Configuration</h1>
          <p><strong>Development Environment</strong> | <strong>Configuration Guide</strong></p>
          
          <h2>Environment Setup</h2>
          <p>CodeNest development environment configuration for optimal productivity within the VaultMesh™ ecosystem.</p>

          <h2>IDE Configuration</h2>
          <pre><code>
{
  "workbench.colorTheme": "VaultMesh Dark",
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "typescript.preferences.strictNullChecks": true
}
          </code></pre>

          <h2>Development Tools</h2>
          <ul>
            <li><strong>TypeScript:</strong> Strict mode enabled</li>
            <li><strong>ESLint:</strong> Custom VaultMesh™ ruleset</li>
            <li><strong>Prettier:</strong> Consistent code formatting</li>
            <li><strong>Vite:</strong> Fast development server</li>
          </ul>

          <h2>Project Structure</h2>
          <pre><code>
src/
├── components/
├── pages/
├── lib/
├── hooks/
└── types/
          </code></pre>

          <h2>Development Workflow</h2>
          <ol>
            <li>Feature branch creation</li>
            <li>Local development and testing</li>
            <li>Code review and approval</li>
            <li>Integration testing</li>
            <li>Production deployment</li>
          </ol>
        </div>
      `
    }

    // Use the detailed content from documentContent mapping first
    const contentKey = String(document.id);
    const detailedContent = documentContent[contentKey] || documentContent[document.title?.toLowerCase().replace(/[^a-z0-9]/g, '-')];
    
    if (detailedContent) {
      return detailedContent;
    }

    // Generate meaningful content based on document information
    return `
      <div class="document-content">
        <h1>${document.title}</h1>
        <p class="lead">${document.description}</p>
        
        <h2>Document Overview</h2>
        <p>This document is part of the VaultMesh™ legal documentation system and provides comprehensive information for ${document.category} purposes.</p>
        
        <div class="document-details">
          <h3>Document Specifications</h3>
          <ul>
            <li><strong>Type:</strong> ${getDocumentType(document.id)}</li>
            <li><strong>Status:</strong> ${getDocumentStatus(document.id)}</li>
            <li><strong>Priority:</strong> ${getDocumentPriority(document.id)}</li>
            <li><strong>Size:</strong> ${getDocumentSize(document.id)}</li>
            <li><strong>Author:</strong> ${getDocumentAuthor(document.id)}</li>
          </ul>
        </div>
        
        <h2>VaultMesh™ Integration</h2>
        <p>This document is integrated with the VaultMesh™ infrastructure ensuring secure access, audit trails, and compliance with enterprise security standards.</p>
        
        <h2>Legal Compliance</h2>
        <p>All documentation follows enterprise compliance standards and regulatory requirements for the Fruitful Holdings ecosystem.</p>
      </div>
    `;
  }
    return `
      <div class="document-content">
        <h1>${document.title}</h1>
        <p class="lead">${document.description}</p>
        
        <h2>Document Overview</h2>
        <p>This document is part of the VaultMesh™ legal documentation system and provides comprehensive information for ${document.category} purposes.</p>
        
        <div class="document-details">
          <h3>Document Specifications</h3>
          <ul>
            <li><strong>Document Type:</strong> ${document.type || getDocumentType(document.id)}</li>
            <li><strong>Category:</strong> ${document.category}</li>
            <li><strong>Priority Level:</strong> ${document.priority || getDocumentPriority(document.id)}</li>
            <li><strong>Author:</strong> ${document.author || getDocumentAuthor(document.id)}</li>
            <li><strong>File Size:</strong> ${document.size || getDocumentSize(document.id)}</li>
          </ul>
        </div>
        
        ${document.category === 'contracts' ? `
          <h2>Legal Notice</h2>
          <p>This is a legally binding document. All parties must review and understand the terms before proceeding. Contact the Legal Team for clarification on any provisions.</p>
          
          <h2>Key Provisions</h2>
          <ul>
            <li>Confidentiality obligations</li>
            <li>Non-disclosure requirements</li>
            <li>Duration and termination</li>
            <li>Permitted disclosures</li>
          </ul>
        ` : ''}
        
        ${document.category === 'technical' ? `
          <h2>Technical Documentation</h2>
          <p>This technical document provides detailed implementation guidance and specifications for system integration within the VaultMesh™ ecosystem.</p>
          
          <h2>Implementation Notes</h2>
          <ul>
            <li>Follow security protocols</li>
            <li>Maintain version control</li>
            <li>Test in development environment</li>
            <li>Document any customizations</li>
          </ul>
        ` : ''}
        
        ${document.category === 'minutes' ? `
          <h2>Meeting Summary</h2>
          <p>This document contains meeting minutes and action items from project discussions.</p>
          
          <h2>Meeting Details</h2>
          <ul>
            <li>Date: ${document.lastUpdated || 'July 19, 2025'}</li>
            <li>Participants: Project stakeholders</li>
            <li>Status: ${document.status || 'active'}</li>
            <li>Follow-up required: Yes</li>
          </ul>
        ` : ''}
        
        <div class="footer">
          <p><small>This document is secured by VaultMesh™ infrastructure and subject to access controls and audit logging.</small></p>
        </div>
      </div>
    `
  }

  const handleDownload = () => {
    setIsLoading(true)
    // Simulate download process
    setTimeout(() => {
      const link = window.document.createElement('a')
      link.href = `/api/legal-documents/${document.id}/download`
      link.download = `${document.title}.${(document.type || getDocumentType(document.id)).toLowerCase()}`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      setIsLoading(false)
    }, 1000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "draft": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {document.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {document.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              VaultMesh™ Secured
            </Badge>
            <Button 
              onClick={handleDownload} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Document Information - Complete details restored */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="font-medium">{document.type || getDocumentType(document.id)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge className={getStatusColor(document.status || "active")}>
                  {document.status || "active"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                <Badge className={getPriorityColor(document.priority || getDocumentPriority(document.id))}>
                  {document.priority || getDocumentPriority(document.id)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                <p className="font-medium">{document.size || getDocumentSize(document.id)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{document.lastUpdated || "July 19, 2025"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Author</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{document.author || getDocumentAuthor(document.id)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Content */}
        <Card>
          <CardHeader>
            <CardTitle>Document Content</CardTitle>
            <CardDescription>
              Rendered within Seedwave™ Portal powered by VaultMesh™
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: getDocumentContent() }}
              style={{
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
                color: "inherit"
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}