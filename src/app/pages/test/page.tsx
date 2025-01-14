"use client";

import React, { useState } from "react";
import BottomSheet from "@/app/_components/_partials/sheet"; // Ganti dengan path file BottomSheet
import Modal from "@/app/_components/_partials/modal";
import PrivacyPolicy from "@/app/_components/_partials/privacyPolicy";

const ExamplePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Button untuk membuka bottom sheet */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Open Bottom Sheet
      </button>
      
      {/* Button untuk membuka modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-4"
      > 
        Open Modal
      </button>

      {/* Modal */} 
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Kebijakan Privasi dan Syarat & Ketentuan"
      >
      
          <PrivacyPolicy />
     
      </Modal>


      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Awesome Sheet"
        initialHeight="60%" // Custom height
      >
        <p className="text-gray-600">This is the content inside the bottom sheet.</p>

      </BottomSheet>
    </div>
  );
};

export default ExamplePage;
