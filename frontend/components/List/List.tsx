import React, { ReactNode } from 'react';

interface ListProps {
  children: ReactNode[];
}

export const List: React.FC<ListProps> = (props) => {
  return <div>{props.children}</div>;
};
