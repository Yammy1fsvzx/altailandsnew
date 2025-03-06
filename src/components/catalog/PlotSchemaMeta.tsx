"use client";

import type { LandPlot } from '@/types'

interface PlotSchemaMetaProps {
  plot: LandPlot
}

export default function PlotSchemaMeta({ plot }: PlotSchemaMetaProps) {
  // Генерируем структурированные данные для микроразметки Schema.org
  const mainImage = plot.images.find(img => img.isMain) || plot.images[0]
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": plot.title,
    "description": plot.description,
    "offers": {
      "@type": "Offer",
      "price": plot.price,
      "priceCurrency": "RUB",
      "availability": plot.status === 'AVAILABLE' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/SoldOut"
    },
    "image": mainImage ? mainImage.url : undefined,
    "productID": plot.id,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Площадь",
        "value": `${plot.area} м²`
      },
      {
        "@type": "PropertyValue",
        "name": "Регион",
        "value": plot.region
      },
      {
        "@type": "PropertyValue",
        "name": "Населенный пункт",
        "value": plot.location
      },
      {
        "@type": "PropertyValue",
        "name": "Категория земель",
        "value": plot.landCategory
      }
    ]
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
} 