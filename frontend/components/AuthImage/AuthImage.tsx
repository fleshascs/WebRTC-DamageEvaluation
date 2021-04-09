import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fetchWrapper } from '../../helpers';

interface AuthImageProps extends React.ButtonHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const AuthImage: React.FC<AuthImageProps> = (props) => {
  const { src, ...other } = props;
  const imgRef = useRef(null);
  const ObjectURLRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src || !ObjectURLRef) return;
    fetch(src, {
      method: 'GET',
      headers: fetchWrapper.authHeader(src)
    })
      .then((response) => response.blob())
      .then((blob) => (ObjectURLRef.current = URL.createObjectURL(blob)));
  }, [imgRef.current]);

  useEffect(() => {
    if (!imgRef.current) return;
    imgRef.current.src = ObjectURLRef.current;
  }, [imgRef.current, ObjectURLRef.current]);

  const onLoad = () => {
    if (!imgRef.current) {
      imgRef.current.src = ObjectURLRef.current;
    }
    setLoaded(true);
  };

  const imageStyle = !loaded ? { display: 'none' } : {};
  return <img ref={imgRef} {...other} style={imageStyle} onLoad={onLoad} />;
};
