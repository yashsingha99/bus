import ClientFeedback from "@/components/ClientFeedback";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="w-full lg:h-96 h-40 flex items-center">
        <div className="lg:text-9xl text-4xl font-semibold lg:mt-20 lg:ml-16 ml-4">
          Seamless <span className="text-[#3e59dd]">Travel</span>
          <br />
          Experiences
        </div>
      </div>
      <ClientFeedback />
    </>
  );
}
