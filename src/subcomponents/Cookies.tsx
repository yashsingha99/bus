"use client";
// [#545cff]
import { Settings } from "lucide-react";
import React, { useState } from "react";

const Cookies = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
  };

  const [selectedOptions, setSelectedOptions] = useState(["essential"]);

  const toggleOption = (option: string) => {
    if (option === "essential") return; // Essential is always selected
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    // <div className="w-1/3 max-w-[300px] mx-auto p-4 px-8">
    //   <div className=" overflow-hidden w-1/3 max-w-[40%] bg-black rounded-2xl p-4 mx-auto">
    //     <div className=" z-[1] flex flex-wrap items-center justify-between gap-4">
    //       <div className="text-white text-sm md:text-base text-xl">
    //         We use cookies
    //       </div>
    //       <div className="relative flex items-center gap-4">
    //         <div className="cursor-pointer text-white">
    //           <Settings />
    //         </div>
    //         <div>
    //           <button className="px-4 py-2 rounded-3xl text-black bg-white hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
    //             Accept
    //           </button>
    //           <div
    //             className="-z-[10] absolute  top-1/3 left-1/2  transform -translate-x-1/2 -translate-y-1/2"
    //             style={{
    //               width: "600px",
    //               height: "100px",
    //               background:
    //                 "radial-gradient(circle, rgb(52, 56, 141) 0%, rgb(52, 56, 141) 30%, rgba(52, 56, 141) 60%, transparent 70%)",
    //               filter: "blur(40px)",
    //             }}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    //   <div className="bg-black" >
    // {  isVisible && (
    //     <div
    //       id="gdpr-cookie-message"
    //       className="fixed bottom-0 left-0 right-0 mx-auto mb-16 w-[calc(100%-4px)] max-w-[420px] z-10 p-4 bg-gradient-to-br from-[#545cff] via-transparent to-transparent text-white flex flex-col gap-4 rounded-t-lg shadow-md opacity-100 transform translate-y-0 transition-opacity ease-out"
    //     >
    //       <div className="gdpr-header flex justify-between items-center">
    //         <div className="text-lg font-semibold">We use cookies</div>
    //         <div className="btn-group flex gap-2">
    //           <button
    //             className="btn bg-gray-800 text-white px-4 py-2 rounded"
    //             id="gdpr-cookie-advanced"
    //             type="button"
    //             disabled
    //           >
    //             Advanced
    //           </button>
    //           <button
    //             className="btn bg-white text-black px-4 py-2 rounded"
    //             id="gdpr-cookie-accept"
    //             type="button"
    //             onClick={handleAccept}
    //           >
    //             Accept
    //           </button>
    //         </div>
    //       </div>
    //       <div className="cookie-message">
    //         <p>Choose which cookies you want to accept:</p>
    //       </div>
    //       <div id="gdpr-cookie-types">
    //         <ul className="flex flex-col gap-2">
    //           <div className="form-check flex items-center gap-2">
    //             <input
    //               className="form-check-input"
    //               type="checkbox"
    //               name="gdpr[]"
    //               value="necessary"
    //               id="fixedCookieTypeDesc"
    //               checked
    //               disabled
    //             />
    //             <label
    //               className="form-check-label"
    //               htmlFor="fixedCookieTypeDesc"
    //               title="These are essential for the website to work correctly."
    //             >
    //               Essential (default)
    //             </label>
    //           </div>
    //           <div className="form-check flex items-center gap-2">
    //             <input
    //               className="form-check-input"
    //               type="checkbox"
    //               id="gdpr-cookietype-preferences"
    //               name="gdpr[]"
    //               value="preferences"
    //             />
    //             <label
    //               className="form-check-label"
    //               htmlFor="gdpr-cookietype-preferences"
    //             >
    //               Site Preferences
    //             </label>
    //           </div>
    //           <div className="form-check flex items-center gap-2">
    //             <input
    //               className="form-check-input"
    //               type="checkbox"
    //               id="gdpr-cookietype-analytics"
    //               name="gdpr[]"
    //               value="analytics"
    //             />
    //             <label
    //               className="form-check-label"
    //               htmlFor="gdpr-cookietype-analytics"
    //             >
    //               Analytics
    //             </label>
    //           </div>
    //           <div className="form-check flex items-center gap-2">
    //             <input
    //               className="form-check-input"
    //               type="checkbox"
    //               id="gdpr-cookietype-marketing"
    //               name="gdpr[]"
    //               value="marketing"
    //             />
    //             <label
    //               className="form-check-label"
    //               htmlFor="gdpr-cookietype-marketing"
    //             >
    //               Marketing
    //             </label>
    //           </div>
    //         </ul>
    //         <a
    //           className="text-link text-blue-400 underline"
    //           href="https://www.artistsweb.com/privacy-policy/"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           More in Privacy Policy
    //         </a>
    //       </div>
    //     </div>
    //   )}
    //   </div>

    <div className="bottom-4 left-4 w-80 rounded-2xl bg-black">
      <div className="relative p-6 space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-normal text-white">
            We use cookies
          </span>
          <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Accept
          </button>
        </div>

        <p className="text-gray-400 text-sm">
          Choose which cookies you want to accept:
        </p>

        <div className="space-y-8 gap-8">
          {[
            { id: "essential", label: "Essential (default)" },
            { id: "preferences", label: "Site Preferences" },
            { id: "analytics", label: "Analytics" },
            { id: "marketing", label: "Marketing" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center ml-8 gap-16 text-white">
              <button
                onClick={() => toggleOption(id)}
                className={`w-6 h-6 p-6 rounded-full border flex items-center justify-center transition-colors
                  ${
                    id === "essential" || selectedOptions.includes(id)
                      ? "bg-[#323688]"
                      : "border-2 border-gray-600"
                  }`}
                disabled={id === "essential"}
              >
                {(id === "essential" || selectedOptions.includes(id)) && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className="text-white">{label}</span>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="text-[#545cff] hover:underline text-sm inline-block"
        >
          More in Privacy Policy
        </a>

        {/* Radial gradient background effect */}
        <div
          className="-z-[10] rounded-full absolute top-1/3 right-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "100px",
            background:
              "radial-gradient(circle, rgb(52, 56, 141) 0%, rgb(52, 56, 141) 30%, rgba(52, 56, 141) 60%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>
    </div>
  );
};

export default Cookies;
