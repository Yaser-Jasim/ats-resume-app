/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas'],
  reactCompiler: true,
};

export default nextConfig;
