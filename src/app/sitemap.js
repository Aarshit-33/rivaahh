import { SITE } from '@/data/site'
import { OCCASIONS_META, TEMPLATES } from '@/templates/data'

export default function sitemap() {
  const u = (path) => `${SITE.url}${path}`
  return [
    { url: u('/'), changeFrequency: 'weekly', priority: 1 },
    { url: u('/occasions'), changeFrequency: 'weekly', priority: 0.9 },
    ...OCCASIONS_META.map((o) => ({ url: u(`/templates/category/${o.slug}`), changeFrequency: 'weekly', priority: 0.8 })),
    ...TEMPLATES.map((t) => ({ url: u(`/templates/${t.id}`), changeFrequency: 'monthly', priority: 0.7 })),
    { url: u('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: u('/contact'), changeFrequency: 'monthly', priority: 0.6 },
    { url: u('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    { url: u('/terms'), changeFrequency: 'yearly', priority: 0.2 },
  ]
}
