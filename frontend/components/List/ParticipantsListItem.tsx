import React, { ReactNode } from 'react';
import utilStyles from '../../styles/utils.module.css';
import { Container, Title } from './ListItem';

interface ListItemProps {
  title: string;
  onClick?: () => void;
  buttonText?: string;
  children?: ReactNode;
}

export const ParticipantsListItem: React.FC<ListItemProps> = (props) => {
  const { title, onClick, buttonText, children } = props;
  return (
    <Container>
      <Title title={title} />
      <div>
        {buttonText ? (
          <div className={utilStyles.link} onClick={onClick}>
            {buttonText}
          </div>
        ) : null}
        {children}
      </div>
    </Container>
  );
};
