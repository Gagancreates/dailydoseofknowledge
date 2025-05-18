/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENROUTER_API_KEY: "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"
  },
  // Ensure server components can access environment variables
  experimental: {
    serverComponentsExternalPackages: []
  }
};

module.exports = nextConfig; 