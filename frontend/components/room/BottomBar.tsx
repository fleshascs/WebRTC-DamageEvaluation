import React from 'react';
import classnames from 'classnames';
import styles from './room.module.css';

interface BottomBarProps {
  toggleMic: () => void;
  toggleCam: () => void;
  takePicture: () => void;
  setGalleryOpen: (boolean) => void;
  setParticipantsOpen: (boolean) => void;
  micState: string;
  webcamState: string;
  canChangeWebcam: boolean;
  peersCount: number;
  roomClient: any;
}

export const BottomBar: React.FC<BottomBarProps> = (props) => {
  const {
    toggleMic,
    toggleCam,
    setGalleryOpen,
    setParticipantsOpen,
    takePicture,
    micState,
    webcamState,
    canChangeWebcam,
    peersCount,
    roomClient
  } = props;

  return (
    <div className={styles.buttonsBlock}>
      <div
        onClick={toggleMic}
        className={classnames(styles.button, { [styles.disabledButton]: micState !== 'on' })}
      >
        <span className='material-icons'>{micState === 'on' ? 'mic' : 'mic_off'}</span>
      </div>
      <div
        onClick={toggleCam}
        className={classnames(styles.button, { [styles.disabledButton]: webcamState !== 'on' })}
      >
        <span className='material-icons'>{webcamState === 'on' ? 'videocam' : 'videocam_off'}</span>
      </div>
      <div className={styles.button} onClick={takePicture}>
        <span className={classnames('material-icons', styles.middleButton)}>photo_camera</span>
      </div>
      {canChangeWebcam ? (
        <div className={styles.button} onClick={() => roomClient.changeWebcam()}>
          <span className='material-icons'>cameraswitch</span>
        </div>
      ) : null}
      <div className={styles.button} onClick={() => setGalleryOpen(true)}>
        <span className='material-icons'>collections</span>
      </div>

      <div className={styles.button} onClick={() => setParticipantsOpen(true)}>
        <span className={styles.badge}>{peersCount + 1}</span>
        <span className='material-icons'>people_alt</span>
      </div>
    </div>
  );
};
