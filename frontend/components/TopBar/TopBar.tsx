import styles from "./topbar.module.css";
import utilStyles from "../../styles/utils.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { accountService } from "../../services";
import { useState, useEffect } from "react";
import { useUser } from "../auth/hooks";

interface TopBarProps {
  title: string;
  backButton?: boolean;
}

export const TopBar: React.FC<TopBarProps> = (props) => {
  const { title, backButton = true } = props;
  const router = useRouter();

  const user = useUser();

  return (
    <div className={styles.container}>
      {backButton ? (
        <div onClick={router.back}>
          <BackIcon />
        </div>
      ) : null}
      <div className={utilStyles.ml2}>{title}</div>
      {user ? (
        <a onClick={accountService.logout} className={styles.logout}>
          Logout
        </a>
      ) : null}
    </div>
  );
};

const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
    </svg>
  );
};
