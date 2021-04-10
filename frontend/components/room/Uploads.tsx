import React, { useState } from 'react';
import classnames from 'classnames';
import roomStyles from '../../styles/room.module.css';
import styles from './room.module.css';
import Modal from 'react-modal';
import getConfig from 'next/config';
import { AuthImage } from '../AuthImage';
import { useUploads } from './hooks';
const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const Uploads: React.FC = () => {
  const [isGalleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryModalImageSrc, setGalleryModalImageSrc] = useState(null);
  const uploads = useUploads();

  return (
    <div className={roomStyles.attachmentsContainer}>
      <Modal
        ariaHideApp={false}
        isOpen={isGalleryModalOpen}
        contentLabel='Gallery'
        style={{
          overlay: {
            zIndex: 10000000
          },
          content: {
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            padding: '0px',
            position: 'relative'
          }
        }}
      >
        <span
          className={classnames('material-icons', styles.closeButton)}
          onClick={() => setGalleryModalOpen(false)}
        >
          close
        </span>
        <AuthImage src={galleryModalImageSrc} className={styles.galleryImage} />
      </Modal>

      {uploads
        ? uploads.map((file) => (
            <div
              className={roomStyles.attachment}
              onClick={() => {
                setGalleryModalOpen(true);
                setGalleryModalImageSrc(baseUrl + file.filePath);
              }}
            >
              <AuthImage src={baseUrl + file.filePath} />
            </div>
          ))
        : null}
    </div>
  );
};
