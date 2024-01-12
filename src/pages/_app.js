import "@/styles/globals.css";
import "../firebase.js";
import { appWithTranslation } from "next-i18next";

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default appWithTranslation(App);
