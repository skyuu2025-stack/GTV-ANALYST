
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOManager: React.FC = () => {
  const currentUrl = "https://gtvassessor.com" + window.location.pathname;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GTV AI Assessor",
    "url": "https://gtvassessor.com",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "ProductivityApplication",
    "description": "Professional AI-driven assessment tool for UK Global Talent Visa endorsement readiness. Analyzes Tech Nation and Arts Council criteria across global talent hubs.",
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
    "name": "UK Global Talent Visa Assessment",
    "provider": {
      "@type": "Organization",
      "name": "GTV Assessor"
    },
    "areaServed": [
      { "@type": "City", "name": "London" },
      { "@type": "City", "name": "New York" },
      { "@type": "City", "name": "San Francisco" },
      { "@type": "City", "name": "Bangalore" },
      { "@type": "City", "name": "Dubai" },
      { "@type": "Country", "name": "United Kingdom" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Visa Assessment Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI GTV Readiness Audit"
          }
        }
      ]
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
        "name": "Eligibility Check",
        "item": "https://gtvassessor.com/eligibility-check"
      }
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://gtvassessor.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gtvassessor.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <link rel="canonical" href={currentUrl} />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
};

export default SEOManager;
