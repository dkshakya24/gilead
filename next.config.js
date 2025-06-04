/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // ✅ Required for WEB_COMPUTE & SSR
  devIndicators: false
};

module.exports = nextConfig;
