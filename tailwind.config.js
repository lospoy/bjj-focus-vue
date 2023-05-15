module.exports = {
  content: ["./public/**/*.html", "./src/**/*.vue"],
  darkMode: "media",
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn .8s ease-in-out',
        fadeInQuick: 'fadeIn .2s ease-in-out',
        fadeOut: 'fadeOut .8s ease-in-out',
        fadeInRight: 'fadeInRight .5s ease-out',
        fadeInLeft: 'fadeInLeft .5s ease-out',
      },
      // that is actual animation
      keyframes: theme => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
        fadeOut: {
          '0%': { opacity: 100 },
          '100%': { opacity: 0 },
        },
        fadeInRight: {
          '0%': { left: '3%' },
          '100%': { left: '50%' },
        },
        fadeInLeft: {
          '0%': { left: '50%', zIndex: '3' },
          '100%': { left: '3%', zIndex: '3'},
        }
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
        "light-gold": "#fff0c6",
        "dark-purple": "#B130D990",
      },
    },
    fontFamily: {
      poppins: ["Poppins, sans-serif"],
      kanit: ["kanit, sans-serif"],
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
