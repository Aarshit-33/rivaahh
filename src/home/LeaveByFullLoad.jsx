'use client'

import { useEffect } from 'react'

/**
 * While the home page is open, links to other pages load them in full, exactly
 * like the original Vite app did, instead of a client-side transition.
 *
 * The hero's WebGL scene finishes setting itself up asynchronously and was
 * written for a page that is only ever left by a full load; unmounting it
 * mid-setup (a client navigation in the first seconds) made it measure
 * elements that no longer exist. The hero code itself stays untouched.
 * In-page links (#pricing, /#create …) still scroll as before.
 */
export default function LeaveByFullLoad() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return // same page: let it scroll to the hash
      e.preventDefault()
      e.stopPropagation()
      window.location.assign(url.href)
    }
    // Capture phase on the document runs before React's handlers, so the
    // Next <Link> never starts its client-side transition.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
