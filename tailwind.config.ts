import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#adc6ff",
        "inverse-on-surface": "#2a3043",
        "on-tertiary": "#283044",
        "tertiary-fixed": "#dae2fd",
        "on-background": "#dce1fb",
        "secondary-container": "#6f00be",
        "outline-variant": "#424754",
        "surface-bright": "#33394c",
        "on-primary-container": "#00285d",
        "secondary": "#ddb7ff",
        "on-secondary": "#490080",
        "inverse-primary": "#005ac2",
        "surface": "#0c1324",
        "surface-container": "#191f31",
        "primary-fixed": "#d8e2ff",
        "surface-tint": "#adc6ff",
        "on-surface-variant": "#c2c6d6",
        "primary": "#adc6ff",
        "on-error-container": "#ffdad6",
        "on-primary-fixed": "#001a42",
        "error-container": "#93000a",
        "on-primary": "#002e6a",
        "error": "#ffb4ab",
        "on-surface": "#dce1fb",
        "surface-container-low": "#151b2d",
        "tertiary-container": "#8990a8",
        "on-primary-fixed-variant": "#004395",
        "surface-container-highest": "#2e3447",
        "on-tertiary-fixed-variant": "#3f465c",
        "tertiary-fixed-dim": "#bec6e0",
        "primary-container": "#4d8eff",
        "outline": "#8c909f",
        "surface-dim": "#0c1324",
        "tertiary": "#bec6e0",
        "on-tertiary-fixed": "#131b2e",
        "secondary-fixed": "#f0dbff",
        "on-tertiary-container": "#22293d",
        "surface-variant": "#2e3447",
        "on-error": "#690005",
        "inverse-surface": "#dce1fb",
        "surface-container-high": "#23293c",
        "on-secondary-fixed-variant": "#6900b3",
        "on-secondary-container": "#d6a9ff",
        "background": "#0c1324",
        "surface-container-lowest": "#070d1f",
        "on-secondary-fixed": "#2c0051",
        "secondary-fixed-dim": "#ddb7ff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "stack-lg": "32px",
        "container-padding": "24px",
        "gutter": "16px",
        "stack-md": "16px",
        "stack-sm": "8px",
        "unit": "8px"
      },
      fontFamily: {
        "body-lg": ["var(--font-inter)"],
        "headline-md": ["var(--font-montserrat)"],
        "label-sm": ["var(--font-inter)"],
        "body-md": ["var(--font-inter)"],
        "display-lg": ["var(--font-montserrat)"],
        "display-lg-mobile": ["var(--font-montserrat)"]
      },
      fontSize: {
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "display-lg-mobile": ["32px", { "lineHeight": "40px", "fontWeight": "700" }]
      }
    },
  },
  plugins: [],
};
export default config;
