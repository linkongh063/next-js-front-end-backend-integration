/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images from public/ work without config. This enables specific remote hosts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
