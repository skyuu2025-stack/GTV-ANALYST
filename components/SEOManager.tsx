import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AppStep } from '../types.ts';

interface SEOManagerProps {
  currentStep?: AppStep;
}

const SEOManager: React.FC<SEOManagerProps> = ({ currentStep }) => {
  const currentUrl = "https://gtvassessor.com" + window.location.pathname;

  // Dynamic Metadata based on route/step
  let title = "UK Global Talent Visa (GTV) Eligibility Check 2025 | AI Expert Audit";
  let description = "Check your UK Global Talent Visa eligibility instantly. Get a professional AI roadmap for Tech Nation, Arts Council, and RIBA endorsement success in 2025.";

  if (currentStep === AppStep.GUIDE_TECH) {
    title = "Tech Nation Endorsement Guide 2025 | UK Tech Visa AI Audit";
    description = "Master the Tech Nation Global Talent Visa criteria. Use our AI tool to map your technical evidence and innovation impact for a successful endorsement.";
  } else if (currentStep === AppStep.GUIDE_FASHION) {
    title = "Arts Council Fashion Visa Guide | UK Global Talent for Designers";
    description = "Unlock the UK Global Talent Visa for fashion designers. AI-powered evaluation of your lookbooks, runway press, and international industry impact.";
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

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://gtvassessor.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": currentStep === AppStep.FORM ? "Eligibility Check" : "Visa Guide",
        "item": currentUrl
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      <script type="application/ld+json">{JSON.stringify(organizationData)}</script>
      <script type="application/ld+json">{JSON.stringify(softwareData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
    </Helmet>
  );
};

export default SEOManager;