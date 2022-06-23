import { MutableRefObject, useEffect } from "react";

const useOutsideClick = (ref:MutableRefObject<HTMLInputElement | null> ) => {
  
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
      ref.current.checked = false;
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;