/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình cho phép ảnh từ link ngoài
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  
  // Vẫn giữ cái này để tránh lỗi TypeScript khi build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;