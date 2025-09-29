import { useEffect, useState } from "react";
import { UserCircle2, BookOpen, Car, CheckCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const { formData } = useFormDataStore();
  const [completedSteps, setCompletedSteps] = useState({
    dataDiri: false,
    program: false,
    akomodasi: false,
  });

  // Function to check if required fields for a step are filled
  const checkCompletedSteps = () => {
    // Check for dataDiri completion
    const dataDiriCompleted = Boolean(
      formData.nama &&
      formData.email &&
      formData.nomor &&
      formData.gender &&
      formData.kesibukan
    );

    // Check for program completion
    const programCompleted = Boolean(
      formData.paket &&
      formData.cabang &&
      formData.provinsi &&
      formData.periode &&
      formData.kategoriPaket &&
      formData.grade
    );

    const akomodasiCompleted: boolean = formData.lokasijemput === ""
    ? true 
    : formData.cabang === "PARE"
      ? Boolean(formData.lokasijemput !== null && formData.kendaraan && formData.penumpang)  
      : false;  
  
    // Update the completedSteps state based on the form data
    setCompletedSteps({
      dataDiri: dataDiriCompleted,
      program: programCompleted,
      akomodasi: akomodasiCompleted,
    });
  };

  useEffect(() => {
    // Check if the form data is complete whenever it changes
    checkCompletedSteps();
  }, [formData]);

  const getActiveStatus = (path: string) => {
    const pathMap: Record<string, number> = {
      "/": 0,
      "/pages/program": 1,
      "/pages/akomodasi": 2,
      "/pages/konfirmasi": 3,
    };
    return pathMap[path] ?? 0;
  };

  const shouldBeActive = (itemStep: number, currentStep: number) => itemStep <= currentStep;

  const currentStep = getActiveStatus(pathname);

  const buildNavItems = () => {
    const baseItems = [
      {
        label: "Data Diri",
        path: "/",
        step: "dataDiri",
        enabled: true,
        icon: <UserCircle2 className="w-5 h-4.5 lg:mr-2" />,
      },
      {
        label: "Program",
        path: "/pages/program",
        step: "program",
        enabled: completedSteps.dataDiri,
        icon: <BookOpen className="w-5 h-4.5 lg:mr-2" />,
      },
    ];

    const akomodasiItems = formData.cabang === "PARE" ? [
      {
        label: "Akomodasi",
        path: "/pages/akomodasi",
        step: "akomodasi",
        enabled: completedSteps.dataDiri && completedSteps.program,
        icon: <Car className="w-5 h-4.5 lg:mr-2" />,
      },
    ] : [];

    const konfirmasiItems = [
      {
        label: "Konfirmasi",
        path: "/pages/konfirmasi",
        step: "konfirmasi",
        enabled: formData.cabang === "PARE" ? completedSteps.dataDiri && completedSteps.program && completedSteps.akomodasi : completedSteps.dataDiri && completedSteps.program,
        icon: <CheckCircle className="w-5 h-4.5 lg:mr-2" />,
      },
    ];

    return [...baseItems, ...akomodasiItems, ...konfirmasiItems];
  };

  return (
    <nav className="w-full">
      <div className="relative flex items-center justify-between">
        {buildNavItems().map((item, index, array) => (
          <div key={item.path} className="relative flex-1">
            {/* Conditionally render the Link or a div when disabled */}
            {item.enabled ? (
              <Link
                href={item.path}
                className={`group flex items-center h-10 lg:text-base w-full text-xs`}
              >
                <div
                  className={`
                    relative flex items-center justify-center w-full 
                    h-10 lg:text-base text-xs lg:px-4 px-2 font-extrabold
                    ${index !== array.length - 1 ? "chevron-shape" : "last-chevron-shape"}
                    ${shouldBeActive(index, currentStep)
                      ? "bg-main-color text-white"
                      : "bg-[#E5E5E5] text-gray-500"}
                  `}
                  style={{
                    clipPath: index !== array.length - 1
                      ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)'
                      : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)',
                  }}
                >
                  <div className="flex items-center justify-center ml-[0.6rem]">
                    <span className="lg:hidden block">{item.icon}</span>
                    <span className="hidden lg:block">{item.label}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                className="group flex items-center h-10 lg:text-base w-full text-xs cursor-not-allowed opacity-60"
                style={{
                  clipPath: index !== array.length - 1
                    ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)'
                    : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)',
                }}
              >
                <div className="relative flex items-center justify-center w-full h-10 lg:text-base text-xs lg:px-4 px-2 font-extrabold bg-[#E5E5E5] text-gray-500">
                  <div className="flex items-center justify-center ml-[0.6rem]">
                    <span className="lg:hidden block">{item.icon}</span>
                    <span className="hidden lg:block">{item.label}</span>
                  </div>
                </div>
              </div>
            )}

            {!item.enabled && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2">
                <div className="hidden group-hover:block px-3 py-1 text-xs text-white bg-gray-900 rounded-md">
                  Isi data sebelumnya
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .chevron-shape {
          position: relative;
          margin-right: -20px;
        }
        .last-chevron-shape {
          position: relative;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
