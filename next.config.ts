import type { NextConfig } from "next";

function getLocalDevOrigin() {
  try {
    const hostname = new URL(process.env.PUBLIC_SITE_URL ?? "").hostname;
    return /^(?:localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(hostname) ? hostname : null;
  } catch {
    return null;
  }
}

const localDevOrigin = getLocalDevOrigin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: localDevOrigin ? [localDevOrigin] : [],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
