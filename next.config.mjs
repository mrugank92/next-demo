import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization enhancements
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "movies-image.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Bundle analyzer in development
      if (process.env.ANALYZE === "true") {
        import("webpack-bundle-analyzer").then(({ BundleAnalyzerPlugin }) => {
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
              openAnalyzer: false,
            })
          );
        });
      }

      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              chunks: "all",
            },
            common: {
              name: "common",
              minChunks: 2,
              priority: 5,
              chunks: "all",
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Enable experimental features for performance
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ["next-intl"],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withNextIntl(nextConfig);
