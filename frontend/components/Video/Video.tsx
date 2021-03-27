import { forwardRef } from "react";
import styles from "./video.module.css";

export const Video = forwardRef<HTMLVideoElement>((_props, ref) => {
  return <video className={styles.video} ref={ref} />;
});
