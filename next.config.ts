import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "98.93.10.61.nip.io" }, // Seu Backend Prod
      { protocol: "https", hostname: "dbprivate.com.br" },
      { protocol: "https", hostname: "*.supabase.co" },
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // Permite S3 direto
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net", // Permite CloudFront (Seu CDN)
      }, // Supabase Storage
    ],
  },
  // Isso ajuda a evitar erros de hidratação com algumas libs antigas
  reactStrictMode: false,
};

export default nextConfig;
