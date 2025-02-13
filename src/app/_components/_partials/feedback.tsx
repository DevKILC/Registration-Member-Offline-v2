"use client";

import { useState } from 'react';
import { FaStar } from "react-icons/fa";
import Button from './button';
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useFeedbackDataHook } from '@/app/hooks/useFeedbackDataHook';

export default function FeedbackPopup({}) {

  const { formData, updateField } = useFormDataStore();
  const { handleSubmitFeedback } = useFeedbackDataHook();
  
  const getIsPopupOpen = () => {
    try {
      const isPopupOpen = useFormDataStore.getState().isPopupOpen;
      if(isPopupOpen) {
        return true;
      }
    } catch (error) {
      console.error("Error getting isPopupOpen:", error);
      return null;
    }
  }

  const [hover, setHover] = useState<number | null>(null);

  const handleRating = (rate: number) => {
    updateField("rating", rate);
  };

  const handleSubmit = () => {
    handleSubmitFeedback();
  };

  return (
    <>
      {/* Popup Content */}
      {getIsPopupOpen() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="absolute bottom-0 lg:bottom-1/4 bg-white rounded-lg shadow-lg p-6 w-full lg:max-w-md">
            {/* Skip Button */}
            <div className="flex flex-row justify-between w-full px-1">
              {/* Title */}
              <h3 className="text-base text-gray-800">Customer Feedback</h3>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center mb-5 my-5">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input type="radio" name="rating" value={formData.rating} className="hidden" onClick={() => handleRating(ratingValue)} />
                    <FaStar
                      className="transition-colors duration-200"
                      size={40}
                      color={ratingValue <= (hover || formData.rating || 0) ? "#FACC14" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>

            {/* Feedback Textarea */}
            <textarea
              className="w-full h-24 p-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-main-color focus:outline-none resize-none mb-5"
              placeholder="Masukan anda sangat berharga bagi kami , tulis masukan anda disini"
              value={formData.feedback}
              onChange={(e) => updateField("feedback", e.target.value)}
            ></textarea>

            {/* Submit Button */}
            <Button className="w-full" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

