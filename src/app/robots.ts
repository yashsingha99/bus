import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '*',
      disallow: [
        '/api/',
        '/AATKHARK/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: 'https://www.bustify.in/sitemap.xml',
  };
} 