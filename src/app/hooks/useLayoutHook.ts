import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";

// Default imports from general folder
import defaultLogo from "../_components/_assets/general/logolc.png";
import defaultTag from "../_components/_assets/general/logo.png";
import defaultJk from "../_components/_assets/general/jk.png";
import defaultBack from "../_components/_assets/general/back.jpg";

// Helper function to extract src from Next.js image object
const getImageSrc = (imageImport: any): string => {
  if (typeof imageImport === 'string') {
    return imageImport;
  }
  return imageImport?.src || imageImport?.default?.src || '';
};

// Define the custom hook
const useLayoutHook = () => {
  const [themeAssets, setThemeAssets] = useState({
    logo: defaultLogo,
    tag: defaultTag,
    jk: defaultJk,
    back: defaultBack,
  });

  useEffect(() => {
    
    // Set the CSS variables dynamically
    const setCSSVariables = () => {
      document.documentElement.style.setProperty("--main-color", process.env.NEXT_PUBLIC_MAIN_COLOR || "#facc14");
      document.documentElement.style.setProperty("--main-color-50", tinycolor(process.env.NEXT_PUBLIC_MAIN_COLOR || "#facc14").lighten(45).toString());
      document.documentElement.style.setProperty("--main-color-200", tinycolor(process.env.NEXT_PUBLIC_MAIN_COLOR || "#facc14").lighten(20).toString());
      document.documentElement.style.setProperty("--main-color-500", process.env.NEXT_PUBLIC_MAIN_COLOR || "#facc14");
      document.documentElement.style.setProperty("--main-color-700", tinycolor(process.env.NEXT_PUBLIC_MAIN_COLOR || "#facc14").darken(20).toString());
      document.documentElement.style.setProperty("--bill", process.env.NEXT_PUBLIC_BILL_COLOR || "#5CB338");
      document.documentElement.style.setProperty("--text-color", process.env.NEXT_PUBLIC_TEXT_COLOR || "#ffffff");
    };

    // Load theme-based assets dynamically
    const loadThemeAssets = async () => {
      const theme = process.env.NEXT_PUBLIC_IMAGE_THEME || 'general';
      console.log("Loading theme assets for:", theme);

      try {
        let themeFolder = '';
        
        switch (theme) {
          case 'holiday-ceria':
            themeFolder = 'holiday';
            break;
          case 'desember-ceria':
            themeFolder = 'desember';
            break;
          case 'ramadhan-ceria':
            themeFolder = 'ramadhan';
            break;
          case 'general':
          default:
            themeFolder = 'general';
            break;
        }

        // Dynamic imports based on theme
        const [logoModule, tagModule, jkModule, backModule] = await Promise.all([
          import(`../_components/_assets/${themeFolder}/logolc.png`).catch(() => ({ default: defaultLogo })),
          import(`../_components/_assets/${themeFolder}/logo.png`).catch(() => ({ default: defaultTag })),
          import(`../_components/_assets/${themeFolder}/jk.png`).catch(() => ({ default: defaultJk })),
          import(`../_components/_assets/${themeFolder}/back.jpg`).catch(() => ({ default: defaultBack })),
        ]);

        setThemeAssets({
          logo: logoModule.default,
          tag: tagModule.default,
          jk: jkModule.default,
          back: backModule.default,
        });

        console.log(`Theme assets loaded successfully for: ${theme}`);
      } catch (error) {
        console.error("Error loading theme assets:", error);
        // Fallback to default assets if theme assets fail to load
        setThemeAssets({
          logo: defaultLogo,
          tag: defaultTag,
          jk: defaultJk,
          back: defaultBack,
        });
      }
    };

    setCSSVariables();
    loadThemeAssets();
  }, []); // Empty dependency array means it will only run on mount

  // Create background style with fallback to theme background
  // Extract the actual src string from the image object
  const backgroundImageUrl = process.env.NEXT_PUBLIC_BACKGROUND_IMAGE_URL || getImageSrc(themeAssets.back);
  
  const sectionStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  // Only add background properties if URL exists
  if (backgroundImageUrl && backgroundImageUrl !== '') {
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundRepeat = 'no-repeat';
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`;
  }

  return {
    sectionStyle,
    tagImage: process.env.NEXT_PUBLIC_TAG_IMAGE_URL || getImageSrc(themeAssets.tag) || '',
    jkImage: process.env.NEXT_PUBLIC_JK_IMAGE_URL || getImageSrc(themeAssets.jk) || '',
    logoImage: process.env.NEXT_PUBLIC_LOGO_IMAGE_URL || getImageSrc(themeAssets.logo),
    hasBackground: !!(backgroundImageUrl && backgroundImageUrl !== ''),
  };
};

export default useLayoutHook;