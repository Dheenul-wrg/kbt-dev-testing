import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'export', // 👈 enable static export
  images: { unoptimized: true }, // 👈 disable Next.js Image optimization (needs a server)
  basePath: '/kbt-dev-testing', // 👈 use your GitHub repo name
  assetPrefix: '/kbt-dev-testing/',
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
