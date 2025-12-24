import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AppStep } from '../types.ts';

interface SEOManagerProps {
  currentStep?: AppStep;
}

const SEOManager: React.FC<SEOManagerProps> = ({ currentStep }) => {
  const currentUrl = "https://gtvassessor.com" + window.location.pathname;

  // Dynamic Metadata based on route/step
  let title = "UK Global Talent Visa (GTV) Eligibility Check 2025 | Dubai & Global AI Audit";
  let description = "Check your UK Global Talent Visa eligibility instantly. Professional AI roadmap for Tech Nation and Arts Council endorsements. Expert support in London, Dubai, SF, and Singapore.";

  if (currentStep === AppStep.GUIDE_TECH) {
    title = "Tech Nation Endorsement Guide 2025 | Dubai & London Tech Visa AI Audit";
    description = "Master the Tech Nation Global Talent Visa criteria. Use our AI tool to map your technical evidence and innovation impact from our Dubai or London hubs.";
  } else if (currentStep === AppStep.GUIDE_FASHION) {
    title = "Arts Council Fashion Visa Guide | UK Global Talent for Dubai Designers";
    description = "Unlock the UK Global Talent Visa for fashion designers. AI-powered evaluation of your lookbooks, runway press, and international impact for UAE-based talent.";
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GTV Assessor",
    "url": "https://gtvassessor.com",
    "logo": "https://gtvassessor.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@gtvassessor.com",
      "contactType": "customer support"
    }
  };

  // Global Hubs Schema
  const hubsData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "LocalBusiness",
        "name": "GTV Assessor London",
        "address": { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "UK" },
        "url": "https://gtvassessor.com/#london"
      },
      {
        "@type": "LocalBusiness",
        "name": "GTV Assessor Dubai",
        "address": { "@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "UAE" },
        "url": "https://gtvassessor.com/#dubai"
      },
      {
        "@type": "LocalBusiness",
        "name": "GTV Assessor Singapore",
        "address": { "@type": "PostalAddress", "addressLocality": "Singapore", "addressCountry": "Singapore" },
        "url": "https://gtvassessor.com/#singapore"
      }
    ]
  };

  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GTV AI Assessor",
    "url": "https://gtvassessor.com",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "ProductivityApplication",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "19.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "520"
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      <script type="application/ld+json">{JSON.stringify(organizationData)}</script>
      <script type="application/ld+json">{JSON.stringify(softwareData)}</script>
      <script type="application/ld+json">{JSON.stringify(hubsData)}</script>
    </Helmet>
  );
};

export default SEOManager;