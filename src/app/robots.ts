import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/reports', '/print/', '/api/'],
    },
    sitemap: 'https://rules.silverballmania.com/sitemap.xml',
  }
}
