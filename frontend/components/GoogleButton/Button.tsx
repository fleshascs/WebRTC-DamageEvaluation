import React, { ReactChild, forwardRef } from 'react';
import styles from './button.module.css';
import classnames from 'classnames';

interface ButtonProps {
  children: ReactChild;
  className?: string;
}

export const Button = forwardRef<HTMLAnchorElement, ButtonProps>((props, ref) => {
  return (
    <a className={classnames(styles.button, props.className)} ref={ref}>
      {props.children}
    </a>
  );
});
