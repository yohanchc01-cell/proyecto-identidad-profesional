export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5D5FEF",
          dark: "#1E1B39",
          light: "#F5F7FB"
        },
        folder: {
          red: "#FF5E5E",
          blue: "#4D7DF2",
          orange: "#FFA000",
          green: "#27AE60"
        }
      },
      borderRadius: {
        "md": "16px",
        "lg": "24px",
        "2xl": "32px",
        "3xl": "40px"
      },
      boxShadow: {
        "soft": "0px 4px 20px rgba(0, 0, 0, 0.05)",
        "medium": "0px 10px 30px rgba(0, 0, 0, 0.1)"
      }
    },
  },
  plugins: [],
};