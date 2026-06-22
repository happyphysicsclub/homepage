import type { MetadataRoute } from 'next'
import { APP_INFO } from '@/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_INFO.url

  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/works`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.6 },
  ]
}
