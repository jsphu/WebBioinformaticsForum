import { useState, useEffect } from "react";

export function useFadeTransition(isOpen, delay) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      setShouldRender(true);   // mount immediately
      requestAnimationFrame(() => setIsVisible(true)); // trigger animation
    } else {
      setIsVisible(false);     // start fade-out
      timeoutId = setTimeout(() => setShouldRender(false), delay);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen, delay]);

  return { shouldRender, isVisible };
}
