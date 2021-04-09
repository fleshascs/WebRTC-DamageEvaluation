import React, { useEffect, useState } from 'react';
import { fetchWrapper } from '../../helpers';

interface AuthImageProps extends React.ButtonHTMLAttributes<HTMLImageElement> {
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
      .then(convertBlobToBase64)
      .then((base64) => setImgSrc(base64 as string));
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

const convertBlobToBase64 = (blob: Blob): Promise<FileReader['result']> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
