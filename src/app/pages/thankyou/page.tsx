import FeedbackPopup from "@/app/_components/_partials/feedback";
import Image from "next/image";
import SuccessGif from "@/app/_components/_assets/success.gif";

export default function ThankYou() {
  return (
    <div className="w-full min-h-screen flex flex-col lg:items-center md:items-center p-4">
      <FeedbackPopup />

      <Image
        src={SuccessGif}
        alt="Success"
        width={200}
        height={200}
        className="w-[400px] md:w-[300px]"
      />

      <div className="flex flex-col max-w-md px-4">
        <h1 className="text-xl md:text-2xl font-bold text-center mt-0">
          Terima Kasih Banyak! 🎉
        </h1>
        <p className="text-center text-gray-600 text-sm md:text-base mt-2">
          Kamu luar biasa! Terima kasih sudah mempercayakan <span className="font-semibold">Language Center</span> untuk jadi partner suksesmu! 💪✨
        </p>
        <p className="text-center text-gray-600 text-sm md:text-base mt-1">
          Tim kami akan segera menghubungi kamu. Stay tuned! 🚀
        </p>
      </div>

    </div>
  );
}
