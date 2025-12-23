import React from 'react';
import { Helmet } from "react-helmet-async";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items?: FAQItem[];
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "What is the UK Global Talent Visa?",
    answer: "The UK Global Talent Visa allows highly skilled professionals in fields such as technology, fashion, and the arts to live and work in the UK without employer sponsorship."
  },
  {
    question: "Who is eligible for the Global Talent Visa?",
    answer: "Eligibility is based on professional achievements, recognition, and impact in your field. Applicants are assessed as either Exceptional Talent or Exceptional Promise."
  },
  {
    question: "How does the GTV AI Assessor work?",
    answer: "GTV AI Assessor analyzes your background against UK Home Office criteria to provide an instant eligibility assessment, highlighting strengths and areas for improvement."
  }
];

export default function FAQSchema({ items = DEFAULT_FAQS }: FAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
}
