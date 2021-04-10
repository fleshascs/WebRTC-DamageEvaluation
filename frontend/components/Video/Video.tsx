import { forwardRef } from 'react';

export const Video = forwardRef<HTMLVideoElement, React.HTMLProps<HTMLVideoElement>>(
  (props, ref) => {
    const { className, ...rest } = props;
    return <video className={className} {...rest} ref={ref} />;
  }
);
