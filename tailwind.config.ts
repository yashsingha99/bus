import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        ".scrollbar-none": {
          "scrollbar-width": "none", // Hides scrollbar for Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Hides scrollbar for Chrome/Safari
          },
        },
      });
    },
  ],
};
export default config;
