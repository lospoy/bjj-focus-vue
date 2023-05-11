module.exports = {
  content: ["./public/**/*.html", "./src/**/*.vue"],
  darkMode: "media",
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn .8s ease-in-out',
      },
      // that is actual animation
      keyframes: theme => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
      }),
      colors: {
        "faint-peach": "#fff4f0",
        "at-faint-orange": "#fe6945",
        "at-light-orange": "#d85a3b",
        "at-orange": "#a4442d",
        "light-grey": "#f7f7f7", // this one changes the charts background color
        "light-grey2": "#727272",
        "med-grey3": "#3d4244",
        "med-grey2": "#8f9b9f",
        "med-grey": "#4b5153",
        "dark-grey": "#292c2d",
        "dark-grey2": "#2c2f30",
        "gold": "#ffcc41",
        "light-gold": "#fff0c6"
      },
    },
    fontFamily: {
      Poppins: ["Poppins, sans-serif"],
    },
    flex: {
      1: "1 1 0%",
      2: "2 2 0%",
    },
    container: {
      center: true,
      screens: {
        lg: "1124px",
        xl: "1124px",
        "2xl": "1124px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
