/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lets several dev servers run side by side (e.g. NEXT_DIST_DIR=.next-contact).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['motion', 'gsap'],
  },
  // The templates landing was renamed "Occasions"; old links keep working
  // (the query string, e.g. ?style=royal, is carried over).
  async redirects() {
    return [{ source: '/templates', destination: '/occasions', permanent: true }]
  },
};

export default nextConfig;
