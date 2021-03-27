import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../Button";

function getPWADisplayMode() {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  if (document.referrer.startsWith("android-app://")) {
    return "twa";
  } else if (navigator.standalone || isStandalone) {
    return "standalone";
  }
  return "browser";
}

export const PWAButton: React.FC = () => {
  const deferredPrompt = useRef(null);
  const [PWAAvailable, setPWAAvailable] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [displayMode, setDisplayMode] = useState(null);

  const beforeInstallPrompt = useCallback((e) => {
    e.preventDefault();
    setPWAAvailable(true);
    deferredPrompt.current = e;
  }, []);

  const appInstalled = useCallback(() => {
    deferredPrompt.current = null;
    setIsPWAInstalled(true);
  }, []);

  const showPWAPrompt = () => {
    deferredPrompt.current.prompt();
  };
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    window.addEventListener("appinstalled", appInstalled);
    setDisplayMode(getPWADisplayMode());
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
      window.removeEventListener("appinstalled", appInstalled);
    };
  }, []);

  //   if (PWAAvailable && displayMode == "browser") {
  //     return <button onClick={showPWAPrompt}>Download APP</button>;
  //   }

  return <Button onClick={showPWAPrompt}>Download the APP</Button>;

  return null;
};
