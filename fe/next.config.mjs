/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.PLT_BUILD_OUTPUT || ".next",
};

export default nextConfig;
