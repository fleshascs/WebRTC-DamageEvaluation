import React, { useEffect, useState } from 'react';
import { fetchWrapper } from '../../helpers';

interface AuthImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
}

export const AuthImage: React.FC<AuthImageProps> = (props) => {
  const { src, ...other } = props;
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!src) return;
    fetch(src, {
      method: 'GET',
      headers: fetchWrapper.authHeader(src)
    })
      .then((response) => response.blob())
      .then((blob) => setImgSrc(URL.createObjectURL(blob)));
  }, []);

  const imageStyle = !loaded ? { display: 'none' } : {};
  return (
    <img
      {...other}
      src={imgSrc}
      style={imageStyle}
      onLoad={() => {
        setLoaded(true);
      }}
    />
  );
};
