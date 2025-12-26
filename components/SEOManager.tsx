import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AppStep } from '../types.ts';

interface SEOManagerProps {
  currentStep?: AppStep;
}

const SEOManager: React.FC<SEOManagerProps> = ({ currentStep }) => {
  const baseUrl = "https://gtvassessor.com";
  const path = window.location.pathname;
  const currentUrl = baseUrl + path;

  // Dynamic Metadata based on route/step
  let title = "UK Global Talent Visa (GTV) Eligibility Check 2025 | Global AI Audit";
  let description = "Check your UK Global Talent Visa eligibility instantly. Professional AI roadmap for Tech Nation and Arts Council endorsements. Expert support in London, Dubai, SF, and Singapore.";
  let pageName = "Home";
  let ogImage = `${baseUrl}/og-main.png`;

  if (currentStep === AppStep.GUIDE_TECH) {
    title = "Tech Nation Endorsement Guide 2025 | London & Dubai Tech Visa AI Audit";
    description = "Master the Tech Nation Global Talent Visa criteria. Use our AI tool to map your technical evidence and innovation impact from our Dubai or London hubs.";
    pageName = "Tech Nation Guide";
    ogImage = `${baseUrl}/og-tech.png`;
  } else if (currentStep === AppStep.GUIDE_FASHION) {
    title = "Arts Council Fashion Visa Guide | UK Global Talent for Global Designers";
    description = "Unlock the UK Global Talent Visa for fashion designers. AI-powered evaluation of your lookbooks, runway press, and international impact.";
    pageName = "Fashion Design Guide";
    ogImage = `${baseUrl}/og-fashion.png`;
  } else if (currentStep === AppStep.GUIDE_GENERAL) {
    title = "Global Talent Visa (GTV) Overview 2025 | Requirements & Endorsement Bodies";
    description = "Comprehensive guide to UK Global Talent Visa requirements for 2025. Learn about Arts Council, Tech Nation, and RIBA endorsement routes.";
    pageName = "GTV Overview";
  } else if (currentStep === AppStep.FORM) {
    title = "GTV Eligibility Self-Assessment Tool | UK Global Talent Visa AI Intake";
    description = "Start your professional GTV eligibility audit. Secure AI intake form for benchmarking your career against UK Home Office standards.";
    pageName = "Eligibility Check";
  }

  // 1. Organization Schema
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GTV Assessor",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "sameAs": [
      "https://twitter.com/gtvassessor",
      "https://linkedin.com/company/gtvassessor"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@gtvassessor.com",
      "contactType": "customer support"
    }
  };

  // 2. WebSite Schema
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GTV Assessor",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // 3. Breadcrumb Schema
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      ...(currentStep !== AppStep.LANDING ? [{
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": currentUrl
      }] : [])
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* GEO Tags for SEO */}
      <meta name="geo.region" content="GB;AE;SG;US" />
      <meta name="geo.position" content="51.5074;-0.1278" />
      <meta name="ICBM" content="51.5074, -0.1278" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(organizationData)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>

      {/* Social Meta Refresh */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOManager;