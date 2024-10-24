import { defineFlytrapConfig } from "useflytrap";

export default defineFlytrapConfig({
  projectId: process.env.FLYTRAP_PROJECT_ID!,
  publicApiKey: process.env.FLYTRAP_PUBLIC_API_KEY!,
  secretApiKey: process.env.FLYTRAP_SECRET_API_KEY!,
  privateKey: process.env.FLYTRAP_PRIVATE_KEY!,
  mode: "capture",
  excludeDirectories: [".next"],
  packageIgnores: ["next/font", "zod"],
});
