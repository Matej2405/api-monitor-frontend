import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: {
            50: { value: "#faf5ff" },
            100: { value: "#f3e8ff" },
            200: { value: "#e9d5ff" },
            300: { value: "#d8b4fe" },
            400: { value: "#c084fc" },
            500: { value: "#a855f7" },
            600: { value: "#9333ea" },
            700: { value: "#7e22ce" },
            800: { value: "#6b21a8" },
            900: { value: "#581c87" },
          },
          pink: {
            500: { value: "#ec4899" },
            600: { value: "#db2777" },
          },
          success: {
            500: { value: "#10b981" },
          },
          warning: {
            500: { value: "#f59e0b" },
          },
          error: {
            500: { value: "#ef4444" },
          },
          blue: {
            500: { value: "#3b82f6" },
          },
          background: {
            dark: { value: "#0f0a1f" },
            card: { value: "#1a1128" },
          }
        },
      },
    },
  },
  
  outdir: "styled-system",
})