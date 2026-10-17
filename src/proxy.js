import { NextResponse } from 'next/server'
import { OCCASIONS_META, TEMPLATES } from '@/templates/data'

// Template and category pages are prerendered for every known id. Any other id
// is sent to the not-found page *with a 404 status* before rendering starts,
// so search engines never index a soft 404.
const IDS = new Set(TEMPLATES.map((t) => t.id))
const SLUGS = new Set(OCCASIONS_META.map((o) => o.slug))

export function proxy(request) {
  const parts = request.nextUrl.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  // /templates/<id>
  const unknownId = parts.length === 2 && parts[1] !== 'category' && !IDS.has(parts[1])
  // /templates/category/<slug>
  const unknownSlug = parts.length === 3 && parts[1] === 'category' && !SLUGS.has(parts[2])
  // /templates/category (no slug) or anything deeper
  const stray = parts.length > 3 || (parts.length === 2 && parts[1] === 'category')
  if (unknownId || unknownSlug || stray) {
    return NextResponse.rewrite(new URL('/__not-found', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/templates/:path+',
}
