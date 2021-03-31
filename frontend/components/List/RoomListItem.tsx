import React, { ReactChild } from "react";
import Link from "next/link";
import utilStyles from "../../styles/utils.module.css";
import { Container, Title } from "./ListItem";

interface ListItemProps {
  title: string;
  subText?: ReactChild;
  url?: string;
  live?: boolean;
  onClick?: () => void;
  buttonText?: string;
}

export const RoomListItem: React.FC<ListItemProps> = (props) => {
  const { title, subText, url, live } = props;
  return (
    <Container>
      <Title title={title} subText={subText} live={live} />
      <div>
        <Link href={url}>
          <a className={utilStyles.link}>Join</a>
        </Link>
      </div>
    </Container>
  );
};
