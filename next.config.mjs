import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  // Avoid picking a parent directory when another lockfile exists (e.g. under /home/ubuntu).
  turbopack: {
    root: projectRoot,
  },
};

export default withMDX(config);
