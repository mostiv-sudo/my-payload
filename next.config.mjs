import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nyaa.shikimori.one',
        port: '',
        pathname: '/**', // разрешаем все пути
      },
      {
        protocol: 'https',
        hostname: 'dere.shikimori.one',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shikimori.one',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
