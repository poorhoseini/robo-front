/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      hmrRefreshes: true,
      fullUrl: true,
    },
  },
};

export default nextConfig;
