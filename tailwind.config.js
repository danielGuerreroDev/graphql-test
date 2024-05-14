import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {},
    colors: {
      primary: "#fc3c17",
      secondary: "#ede1fd",
      acid: "#f1f150",
      white: "#fff",
      lighter: "#fefaf9",
      "light-body": "#f3e8e3",
      header: "#faf8fe",
      body: "#f4f1fc",
      peach: "#f2c9bd",
      skin: "#c69a91",
      brown: "#63372f",
      chocolate: "#4c3439",
      "dark-body": "#2a1613",
      "gender-male": "#a48aee",
      "gender-female": "#f8673a",
      "gender-couple": "#4c3439",
      "gender-non-binary": "#c7c700",
      "gender-anonymous": "#c69a91",
    },
  },
  plugins: [flowbite.plugin()],
};
