import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Anchor Turbopack to the workspace root so it does not wander up to
  // parent directories looking for lockfiles.
  turbopack: {
    root: path.resolve(__dirname, "..", ".."),
  },
  // Ensure public env vars have fallbacks so static generation does not crash
  // when the variables are configured at runtime instead of build time.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      "https://eventforge-api.onrender.com",
  },
};

export default nextConfig;
