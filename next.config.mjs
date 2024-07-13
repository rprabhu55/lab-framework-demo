import remarkGfm from 'remark-gfm';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js configuration
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
};

export default withMDX(nextConfig);