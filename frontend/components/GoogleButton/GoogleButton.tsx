import React, { ReactChild, forwardRef } from 'react';
import styles from './button.module.css';
import classnames from 'classnames';

interface ButtonProps {
  onClick?: () => void;
  children: ReactChild;
  className?: string;
}

export const GoogleButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <button
      className={classnames(styles.button, props.className)}
      onClick={props.onClick}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

{
  /*
   <Link href={`/login`}>
   <GoogleButton>Sign in with Google</GoogleButton>
  </Link> 
  */
}
