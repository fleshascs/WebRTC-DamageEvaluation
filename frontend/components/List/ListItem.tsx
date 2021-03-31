import React, { ReactChild } from "react";
import Link from "next/link";
import styles from "./list.module.css";
import utilStyles from "../../styles/utils.module.css";

interface ListItemProps {
  title: string;
  subText?: ReactChild;
  url?: string;
  live?: boolean;
  onClick?: () => void;
  buttonText?: string;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { title, subText, url, live, onClick, buttonText } = props;
  return (
    <Container>
      <Title title={title} subText={subText} live={live} />
      <div>
        {url ? (
          <Link href={url}>
            <a className={utilStyles.link}>Join</a>
          </Link>
        ) : null}
        {buttonText ? (
          <div className={utilStyles.link} onClick={onClick}>
            {buttonText}
          </div>
        ) : null}
      </div>
    </Container>
  );
};

interface ContainerProps {
  children: React.ReactNode[];
}

export const Container: React.FC<ContainerProps> = (props) => {
  return <div className={styles.listItem}>{props.children}</div>;
};

interface TitleProps {
  title: string;
  subText?: ReactChild;
  live?: boolean;
}

export const Title: React.FC<TitleProps> = (props) => {
  const { title, subText, live } = props;
  return (
    <div>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        {live ? <div className={styles.pulse}></div> : null}
      </div>
      <div className={styles.subText}>{subText}</div>
    </div>
  );
};
