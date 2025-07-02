/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'albasheermblshop.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
