import React, { ReactChild } from "react";

interface ListProps {
  children: ReactChild[];
}

export const List: React.FC<ListProps> = (props) => {
  return <div>{props.children}</div>;
};
