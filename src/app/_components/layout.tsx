import Image from "next/image";
import Navbar from "./_partials/navbar";
import NewNavbar from "./_partials/newNav";
import "../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from "react-toastify";
import useLayoutHook from "../hooks/useLayoutHook";
import tag from "./_assets/logo.png";
import jk from "./_assets/jk.png";
import logo from "./_assets/logolc.png";


interface CustomLayoutProps {
  children: React.ReactNode;
  mainline: string; // Tambahkan mainline
  line: string; // Tambahkan line
}

export default function CustomLayout({
  children,
  mainline,
  line,
}: CustomLayoutProps) {
  const router = useRouter();
  const { sectionStyle, tagImage, jkImage, logoImage } = useLayoutHook(); // Use hook for background and images
  const hasBackgroundImage = sectionStyle.backgroundImage !== undefined && sectionStyle.backgroundImage !== 'url()';
  useEffect(() => {
    // Get data from sessionStorage
    const savedData = sessionStorage.getItem("formData");
    
    // Only attempt to parse if savedData exists
    if (!savedData) {
      // No data in session storage, redirect to home
      router.replace("/");
      return;
    }
    
    try {
      // Parse the JSON data
      const parsedData = JSON.parse(savedData);
      
      // Check if name is empty or undefined
      if (!parsedData.nama || parsedData.nama === '') {
        router.replace("/");
      }
      
    } catch (error) {
      console.error("Error parsing formData from sessionStorage:", error);
      router.replace("/");
    }
  }, [router]);

  const [switchNav, setSwitchNav] = useState(false);

  return (
    <>
     <div
      className={`flex flex-row w-full min-h-screen overflow-y-auto ${!hasBackgroundImage ? "bg-img" : ""}`} 
      style={hasBackgroundImage ? sectionStyle : {}}
    >
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          className="w-full lg:max-w-lg "
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />

        {/* Container */}
        <div className="lg:w-[60%]  w-[100%] bg-white shadow-lg lg:rounded-tr-[40px] lg:rounded-br-[40px] items-center justify-center align-middle">
          <div className="mx-10 my-5">
            {/* Logo */}
            <Image
              src={logoImage || logo}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto animate-bounce"
            />

            {/* Tagline */}
            <TagDescription mainline={mainline} line={line} />

            {/* Navbar */}
            {switchNav ? <Navbar /> : <NewNavbar />}

            {/* Main Content */}
            <div className="mt-5 mb-5 flex-1">{children}</div>
          </div>
        </div> 

        {/* Side Content */}
        <div className="lg:block hidden w-[40%] h-auto">
          <div className="w-full h-full">
            <div className="lg:flex items-center justify-center w-full h-full relative">
              {/* Background image */}
              <Image src={jkImage || jk} alt="Side Image" className="object-cover" layout="fill" priority/>
              {/* Tag image */}
              <Image
                src={tagImage || tag}
                alt="Tag Image"
                width={400}
                height={100}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
          </div>
        </div>

        <div className="fixed top-5 right-5 w-auto h-auto hidden">
          <button onClick={() => setSwitchNav(!switchNav)}>
            {switchNav ? "Switch to New Nav" : "Switch to Old Nav"}
          </button>
        </div>
      </div>
    </>
  );
}

function TagDescription({
  mainline,
  line,
}: {
  mainline: string;
  line: string;
}) {
  return (
    <div className="my-4 text-center w-full mx-auto">
      <p className="font-bold text-black lg:text-base text-sm text-center">
        {mainline} <span>
          {" "}
          <br />{" "}
        </span>{" "}
        <span className="text-gray-500 font-normal lg:text-base text-xs">
          {line || ""}
        </span>{" "}
      </p>
    </div>
  );
}
