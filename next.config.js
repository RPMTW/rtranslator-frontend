/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.modrinth.com",
      },
    ],
  },
};

module.exports = nextConfig;
