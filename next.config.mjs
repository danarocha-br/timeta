import { FlytrapTransformPlugin } from "useflytrap/transform";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins = config.plugins ?? [];
    config.infrastructureLogging = { level: "error" };
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(FlytrapTransformPlugin.webpack());
    }
    return config;
  },
};
export default nextConfig;
