"use client";

import { useState } from 'react';
import { FaStar } from "react-icons/fa";
import Button from './button';


export default function FeedbackPopup({}) {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);

  const handleRating = (rate: number) => {
    setRating(rate);
  };



  const handleSubmit = () => {
    console.log("Feedback Submitted:", { rating, feedback });
    setIsPopupOpen(false); // Close popup after submission
  };

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  return (
    <>
      {/* Popup Content */}
      {isPopupOpen && (
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
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      className="hidden"
                      onClick={() => handleRating(ratingValue)}
                    />
                    <FaStar
                      className="transition-colors duration-200"
                      size={40}
                      color={
                        ratingValue <= (hover || rating || 0) ? "#FACC14" : "#e4e5e9"
                      }
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
              value={feedback}
              onChange={handleFeedbackChange}
            ></textarea>

            {/* Submit Button */}
            <Button
              className="w-full"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

