import React, { ReactChild } from "react";
import Link from "next/link";
import utilStyles from "../../styles/utils.module.css";
import { Container, Title } from "./ListItem";

interface ListItemProps {
  title: string;
  onClick?: () => void;
  buttonText?: string;
  text?: string;
}

export const ParticipantsListItem: React.FC<ListItemProps> = (props) => {
  const { title, onClick, buttonText, text } = props;
  return (
    <Container>
      <Title title={title} />
      <div>
        {buttonText ? (
          <div className={utilStyles.link} onClick={onClick}>
            {buttonText}
          </div>
        ) : null}
        {text}
      </div>
    </Container>
  );
};
