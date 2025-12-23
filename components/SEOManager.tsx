
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOManager: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GTV AI Assessor",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "ProductivityApplication",
    "description": "AI-driven professional assessment tool for the UK Global Talent Visa endorsement process.",
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

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Visa Eligibility Assessment",
    "provider": {
      "@type": "Organization",
      "name": "GTV Assessor"
    },
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "UK Global Talent Visa Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Tech Nation Endorsement Audit"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Arts Council England Eligibility Check"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceData)}
      </script>
    </Helmet>
  );
};

export default SEOManager;
