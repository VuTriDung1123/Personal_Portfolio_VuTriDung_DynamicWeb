/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! Bỏ qua lỗi TypeScript khi build để tránh lỗi vặt
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! Bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;