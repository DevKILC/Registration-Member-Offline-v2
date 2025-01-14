"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle2, BookOpen, Home, CheckCircle } from "lucide-react";
import { FormData } from "@/app/_backend/_utils/Interfaces";

interface CompletedSteps {
  dataDiri: boolean;
  program: boolean;
  akomodasi: boolean;
}

enum NavigationStep {
  DataDiri = 0,
  Program = 1,
  Akomodasi = 2,
  Konfirmasi = 3,
}

interface NavItem {
  label: string;
  path: string;
  step: keyof CompletedSteps | 'konfirmasi';
  enabled: boolean;
  enumValue: NavigationStep;
  icon: React.ReactNode;
}

const Navbar = () => {
  const pathname = usePathname();
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [akomodasi, setAkomodasi] = useState("");
  const [completedSteps, setCompletedSteps] = useState<CompletedSteps>({
    dataDiri: false,
    program: false,
    akomodasi: false,
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing form data from sessionStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    setAkomodasi(formData?.cabang || "");
  }, [formData.cabang]);

  const isProgramComplete = (data: FormData): boolean => {
    if (!data.paket?.value) return false;

    const baseCondition = data.cabang && data.periode && data.paketdetail;
    if (!baseCondition) return false;

    switch (data.paket.value) {
      case "intergrated":
        return Boolean(data.jampertemuan);
      case "private":
        return Boolean(data.jampertemuanprivate1 && data.jampertemuanprivate2);
      default:
        return Boolean(data.tipekamar);
    }
  };

  useEffect(() => {
    setCompletedSteps({
      dataDiri: Boolean(
        formData.nama &&
        formData.email &&
        formData.nomor &&
        formData.gender &&
        formData.kesibukan
      ),
      program: isProgramComplete(formData),
      akomodasi: Boolean(
        formData.cabang === "PARE - JATIM" &&
        (formData.lokasijemput !== "ga_perlu_dijemput"
          ? [formData.kendaraan && formData.penumpang]
          : [])
      ),
    });
  }, [formData]);

  const getActiveStatus = (path: string): NavigationStep => {
    const pathMap: Record<string, NavigationStep> = {
      "/": NavigationStep.DataDiri,
      "/pages/program": NavigationStep.Program,
      "/pages/akomodasi": NavigationStep.Akomodasi,
      "/pages/konfirmasi": NavigationStep.Konfirmasi,
    };
    return pathMap[path] ?? NavigationStep.DataDiri;
  };

  const shouldBeActive = (itemStep: NavigationStep, currentStep: NavigationStep): boolean => {
    return itemStep <= currentStep;
  };

  const currentStep = getActiveStatus(pathname);

  const buildNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        label: "Data Diri",
        path: "/",
        step: "dataDiri",
        enabled: true,
        enumValue: NavigationStep.DataDiri,
        icon: <UserCircle2 className="w-5 h-4.5 lg:mr-2" />,
      },
      {
        label: "Program",
        path: "/pages/program",
        step: "program",
        enabled: completedSteps.dataDiri,
        enumValue: NavigationStep.Program,
        icon: <BookOpen className="w-5 h-4.5 lg:mr-2" />,
      },
    ];

    const akomodasiItems: NavItem[] = akomodasi === "PARE - JATIM" ? [
      {
        label: "Akomodasi",
        path: "/pages/akomodasi",
        step: "akomodasi",
        enabled: completedSteps.program && completedSteps.dataDiri,
        enumValue: NavigationStep.Akomodasi,
        icon: <Home className="w-5 h-4.5 lg:mr-2" />,
      },
    ] : [];

    const konfirmasiItems: NavItem[] = [
      {
        label: "Konfirmasi",
        path: "/pages/konfirmasi",
        step: "konfirmasi",
        enabled: akomodasi === "PARE - JATIM"
          ? completedSteps.akomodasi && completedSteps.program && completedSteps.dataDiri
          : completedSteps.program && completedSteps.dataDiri,
        enumValue: NavigationStep.Konfirmasi,
        icon: <CheckCircle className="w-5 h-4.5 lg:mr-2" />,
      },
    ];

    return [...baseItems, ...akomodasiItems, ...konfirmasiItems];
  };

  return (
    <nav className="w-full">
      <div className="relative flex items-center justify-between">
        {buildNavItems().map((item, index, array) => (
          <div
            key={item.path}
            className="relative flex-1"
          >
            <Link
              href={item.enabled ? item.path : "#"}
              className={`group flex items-center h-10 lg:text-base w-full text-xs${
                !item.enabled ? "cursor-not-allowed" : ""
              }`}
            >
              <div
                className={`
                  relative flex items-center justify-center w-full 
                  h-10 lg:text-base text-xs lg:px-4 px-2 font-extrabold
                  ${index !== array.length - 1 ? "chevron-shape" : "last-chevron-shape"}
                  ${shouldBeActive(item.enumValue, currentStep)
                    ? "bg-main-color text-white"
                    : "bg-[#E5E5E5] text-gray-500"}
                  ${!item.enabled ? "opacity-60" : ""}
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