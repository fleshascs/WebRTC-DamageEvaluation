import React from "react";
import Link from "next/link";
import styles from "./list.module.css";

interface ListItemProps {
  title: string;
  subText: string;
  url: string;
  live: boolean;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  return (
    <div className={styles.listItem}>
      <div>
        <div>
          {props.title}
          {props.live ? <div className={styles.pulse}></div> : null}
        </div>
        <div className={styles.subText}>{props.subText}</div>
      </div>
      <div>
        <Link href={props.url}>
          <a className={styles.joinButton}>Join</a>
        </Link>
      </div>
    </div>
  );
};
