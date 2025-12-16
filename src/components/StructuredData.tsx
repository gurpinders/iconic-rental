export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Iconic Limos & Rentals",
    "description": "Luxury limousine and bus rental service in the Greater Toronto Area. Specializing in weddings, corporate events, proms, and special occasions.",
    "image": "https://your-site.vercel.app/logo_no_bg.png",
    "@id": "https://your-site.vercel.app",
    "url": "https://your-site.vercel.app",
    "telephone": "+1-416-123-4567",
    "email": "info@iconiclimos.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Toronto",
      "addressRegion": "ON",
      "postalCode": "",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.6532,
      "longitude": -79.3832
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 43.6532,
        "longitude": -79.3832
      },
      "geoRadius": "100000"
    },
    "priceRange": "$$-$$$",
    "openingHours": "Mo-Su 00:00-23:59",
    "sameAs": [
      "https://www.facebook.com/iconiclimos",
      "https://www.instagram.com/iconiclimos"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "50"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}