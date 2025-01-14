import Image from "next/image";
// import Link from "next/link";
import logo from "./_assets/logolc.png";
import jk from "./_assets/jk.png";
import tag from "./_assets/logo.png";
import Navbar from "./_partials/navbar";
import NewNavbar from "./_partials/newNav";
import "../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Bounce } from 'react-toastify';

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

  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (!savedData) {
      router.push("/");
    }
  }, [router]);

  const [switchNav, setSwitchNav] = useState(false);
  return (
    <>

      <div className="flex flex-row w-full min-h-screen bg-img overflow-y-auto">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          className="w-full lg:max-w-lg "
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        {/* Container */}
        <div className="lg:w-[60%] w-[100%] bg-white shadow-lg lg:rounded-tr-[40px] lg:rounded-br-[40px] items-center justify-center align-middle">
          <div className="mx-10 my-5">
            {/* Logo */}
            <Image
              src={logo}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto"
            />

            {/* Tagline */}
            <TagDescription mainline={mainline} line={line} />

            {/* Navbar */}

            {switchNav ? <Navbar /> : <NewNavbar />}



            {/* Main Content */}
            <div className="mt-5 mb-5 flex-1">
              {children}
            </div>
          </div>
        </div>

        {/* Side Content */}

        <div className="lg:block hidden w-[40%] h-auto">
  <div className="w-full h-full">
    <div className="lg:flex items-center justify-center w-full h-full relative">
      {/* Background image */}
      <Image 
        src={jk} 
        alt="Side Image"
        className="object-cover"
        priority
      />
      
      {/* Tag image */}
      <Image 
        src={tag} 
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
            {switchNav ? 'Switch to New Nav' : 'Switch to Old Nav'}
          </button>
        </div>

        {/* <Link href="https://cs.kampunginggrislc.com/?utm_content=register" rel="noopener noreferrer" target="_blank">
        <div className="fixed bottom-5 right-5 animate-bounce">
          <div className="w-14 h-14 rounded-full bg-red-600 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0" viewBox="0 -960 960 960" fill="#ffffff">
              <path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" />
            </svg>
            <span className="text-[8px] lg:text-[9px] text-white">Tanya CS</span>

            {/* Tail */}
        {/* 
            <div
              className="absolute bottom-[-3px] -left-1 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-red-600 border-r-[10px] border-r-transparent rotate-[40deg] -z-10"
            ></div>
          </div>
        </div>
      </Link> */}

        {/* <div className="fixed top-5  bg-opacity-90 text-white bg-black p-4 rounded shadow-lg">
        <h3 className="font-bold mb-2">Session Storage Data:</h3>
        <div className="text-sm">
          <span className="font-semibold">formData:</span> {sessionStorage.getItem('formData')}
        </div>
      </div> */}

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
      <p className="font-bold text-black lg:text-base text-sm text-center">{mainline} <span> <br />  </span> <span className="text-gray-500 font-normal lg:text-base text-xs">{line || ''}</span> </p>
    </div>
  );
}