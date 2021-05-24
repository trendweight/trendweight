import { useEffect, useState } from "react";

export const useStartHidden = () => {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    setHidden(false);
  }, []);
  return hidden ? "hidden" : "visible";
};
