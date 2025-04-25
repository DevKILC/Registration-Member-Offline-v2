// hooks/useLayoutHook.ts

import { useEffect } from "react";
import tinycolor from "tinycolor2";
import logo from "../_components/_assets/logo.svg";
import tag from "../_components/_assets/logo.png";
import jk from "../_components/_assets/jk.png";

// Define the custom hook
const useLayoutHook = () => {
  useEffect(() => {
    
    console.log("MAIN COLOR:", process.env.NEXT_PUBLIC_MAIN_COLOR);
    // Set the CSS variables dynamically
    const setCSSVariables = () => {
      console.log("Setting CSS variables");
      document.documentElement.style.setProperty("--main-color", process.env.NEXT_PUBLIC_MAIN_COLOR || "#bd3939");
      document.documentElement.style.setProperty("--main-color-50", tinycolor(process.env.NEXT_PUBLIC_MAIN_COLOR || "#bd3939").lighten(45).toString());
      document.documentElement.style.setProperty("--main-color-200", tinycolor(process.env.NEXT_PUBLIC_MAIN_COLOR || "#bd3939").lighten(20).toString());
      document.documentElement.style.setProperty("--main-color-500", process.env.NEXT_PUBLIC_MAIN_COLOR || "#bd3939");
      document.documentElement.style.setProperty("--main-color-700", tinycolor(process.env.NEXT_PUBLIC_MAIN_COLOR || "#bd3939").darken(20).toString());
      document.documentElement.style.setProperty("--bill", process.env.NEXT_PUBLIC_BILL_COLOR || "#5CB338");
      document.documentElement.style.setProperty("--text-color", process.env.NEXT_PUBLIC_TEXT_COLOR || "#ffffff");
    };

    console.log("NEXT_PUBLIC_MAIN_COLOR:", process.env.NEXT_PUBLIC_MAIN_COLOR);
    
    setCSSVariables();
  }, []); // Empty dependency array means it will only run on mount

  return {
    sectionStyle: {
      width: "100%",
      height: "100%",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKGROUND_IMAGE_URL || ''})`,
    },
    tagImage: process.env.NEXT_PUBLIC_TAG_IMAGE_URL || tag,
    jkImage: process.env.NEXT_PUBLIC_JK_IMAGE_URL || jk,
    logoImage: process.env.NEXT_PUBLIC_LOGO_IMAGE_URL || logo,
  };
};

export default useLayoutHook;
