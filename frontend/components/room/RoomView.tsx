import React, { useEffect, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.css';
import { Video } from '../../components/Video';
import roomStyles from '../../styles/room.module.css';
import styles from './room.module.css';
import { Button } from '../../components/Button';
import { useRoom } from '../../components/room/hooks';
import RoomContext from '../../components/room/RoomContext';
import {
  getRoom,
  getMe,
  getAmActiveSpeaker,
  getAudioProducer,
  getVideoProducer,
  getMicState,
  getWebcamState,
  getPeersCount,
  getCanChangeWebcam
} from '../../redux/selectors';
import Peers from './Peers';
import Me from './Me';
import Sheet from 'react-modal-sheet';
import * as cookiesManager from '../../helpers/cookiesManager';
import { ParticipantsList } from './ParticipantsList';

interface RoomViewProps {
  roomInfo: any;
  isLoading: boolean;
  failed: boolean;
  roomId: string;
}

export const RoomView: React.FC<RoomViewProps> = (props) => {
  const { roomInfo, isLoading, failed, roomId } = props;
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [isParticipantsOpen, setParticipantsOpen] = useState(false);
  const router = useRouter();
  const roomClient = useContext(RoomContext);
  const room = useSelector(getRoom);
  const me = useSelector(getMe);
  const amActiveSpeaker = useSelector(getAmActiveSpeaker);
  const audioProducer = useSelector(getAudioProducer);
  const videoProducer = useSelector(getVideoProducer);
  const micState = getMicState(me, audioProducer);
  const webcamState = getWebcamState(me, videoProducer);
  const canChangeWebcam = getCanChangeWebcam(me, videoProducer);
  const peersCount = useSelector(getPeersCount);

  if (isLoading) return <div className={utilStyles.container}>Loading...</div>;
  if (failed) return <div className={utilStyles.container}>Technical Error, please try later</div>;

  const toggleCam = () => {
    if (webcamState === 'on') {
      cookiesManager.setDevices({ webcamEnabled: false });
      roomClient.disableWebcam();
    } else {
      cookiesManager.setDevices({ webcamEnabled: true });
      roomClient.enableWebcam();
    }
  };
  const toggleMic = () => {
    micState === 'on' ? roomClient.muteMic() : roomClient.unmuteMic();
  };

  return (
    <div className={classnames(utilStyles.container, utilStyles.flexColumn)}>
      <Peers />
      <Me />
      <div style={{ height: '66px' }} />
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
          <span className='material-icons'>
            {webcamState === 'on' ? 'videocam' : 'videocam_off'}
          </span>
        </div>
        <div className={styles.button}>
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
      <Sheet isOpen={isGalleryOpen} onClose={() => setGalleryOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className={roomStyles.attachmentsContainer}>
              <div className={roomStyles.attachment}></div>
              <div className={roomStyles.attachment}></div>
              <div className={roomStyles.attachment}></div>
              <div className={roomStyles.attachment}></div>
              <div className={roomStyles.attachment}></div>
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop />
      </Sheet>

      <Sheet isOpen={isParticipantsOpen} onClose={() => setParticipantsOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className={utilStyles.p1}>
              <ParticipantsList roomId={roomId} />
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};
