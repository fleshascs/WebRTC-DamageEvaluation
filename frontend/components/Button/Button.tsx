import React, { ReactChild } from "react";
import styles from "./button.module.css";
import classnames from "classnames";

interface ButtonProps {
  onClick: () => void;
  children: ReactChild;
  className?: string;
}

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className={classnames(styles.button, props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
