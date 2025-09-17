import React from 'react';

interface BlogPostSchema {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint: {
    "@type": "ContactPoint";
    contactType: "customer service";
    availableLanguage: "Portuguese";
  };
}

interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

interface StructuredDataProps {
  type: 'blogPost' | 'organization' | 'faq' | 'breadcrumb';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'blogPost':
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: data.title,
          description: data.excerpt,
          image: data.coverImage ? [data.coverImage] : [],
          datePublished: data.createdAt,
          dateModified: data.updatedAt,
          author: {
            "@type": "Person",
            name: data.author || "Sobrou Team"
          },
          publisher: {
            "@type": "Organization",
            name: "Sobrou",
            logo: {
              "@type": "ImageObject",
              url: "https://sobrou.app/logo.png"
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://sobrou.app/blog/${data.slug}`
          }
        } as BlogPostSchema;

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Sobrou",
          url: "https://sobrou.app",
          logo: "https://sobrou.app/logo.png",
          description: "Controle suas finanças de forma simples: digite seus gastos em linguagem natural e deixe nossa IA organizar tudo.",
          sameAs: [
            "https://twitter.com/sobrou_app",
            "https://instagram.com/sobrou_app"
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "Portuguese"
          }
        } as OrganizationSchema;

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        } as FAQSchema;

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        } as BreadcrumbSchema;

      default:
        return null;
    }
  };

  const schema = generateSchema();
  
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default StructuredData;