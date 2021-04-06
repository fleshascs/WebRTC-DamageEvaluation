import React, { ReactChild, forwardRef } from 'react';
import styles from './button.module.css';
import classnames from 'classnames';

interface ButtonProps {
  onClick?: () => void;
  children: ReactChild;
  className?: string;
  component?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { component = 'button', className, children, onClick } = props;
  return React.createElement(
    component,
    { className: classnames(styles.button, className), onClick, ref },
    children
  );
});
