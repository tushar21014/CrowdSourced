import { useEffect } from "react";
import "../styles/CustomLoader.css";

const CustomLoader = ({ text = "" }) => {
  // Add ... to the end of the text and animate it
  useEffect(() => {
    const loaderText = document.querySelector(".custom-loader + p");
    if (loaderText) {
      let text = loaderText.innerText;
      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i > 3) {
          i = 0;
          text = loaderText.innerText.replace(/\.{3}/, "");
        }
        loaderText.innerText = text + ".".repeat(i);
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black/80 flex flex-col justify-center items-center">
      <div class="custom-loader" />
      <p className="text-white text-lg mt-2">{text}</p>
    </div>
  );
};

export default CustomLoader;
