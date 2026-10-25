import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        portal: "0 24px 60px rgba(12,44,98,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
