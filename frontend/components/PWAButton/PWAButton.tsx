import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './button.module.css';

function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
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
    window.addEventListener('beforeinstallprompt', beforeInstallPrompt);
    window.addEventListener('appinstalled', appInstalled);
    setDisplayMode(getPWADisplayMode());
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPrompt);
      window.removeEventListener('appinstalled', appInstalled);
    };
  }, []);

  //   if (PWAAvailable && displayMode == "browser") {
  //     return <button onClick={showPWAPrompt}>Download APP</button>;
  //   }

  return (
    <button onClick={showPWAPrompt} className={styles.button}>
      <img
        src='/icons/28352065-2f94fba8-6c4c-11e7-9536-3d8e249e048f.png'
        width='50'
        height='19'
        className={styles.icon}
        alt='PWA App'
      />
      <div>
        <div className={styles.smallText}>Launch now as</div>
        <div className={styles.title}>Web App</div>
      </div>
    </button>
  );

  return null;
};
