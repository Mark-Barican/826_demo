import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /**
   * `next dev` and `next build` share `.next` by default, so building while a
   * dev server is running overwrites its asset manifest and every chunk 404s
   * until the dev server is restarted with `.next` deleted. Setting
   * NEXT_DIST_DIR lets a verification build run into its own directory and
   * leave a live dev server alone.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
