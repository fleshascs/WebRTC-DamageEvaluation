import React, { useContext, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import utilStyles from '../../styles/utils.module.css';
import styles from './room.module.css';
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
import { Uploads } from './Uploads';
import getConfig from 'next/config';
import { AuthImage } from '../AuthImage';
import { BottomBar } from './BottomBar';
import { uploadService } from '../../services';
const { publicRuntimeConfig } = getConfig();
import toast from 'react-hot-toast';
const baseUrl = `${publicRuntimeConfig.apiUrl}/room`;

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
  const fileInput = useRef(null);
  const fileForm = useRef(null);

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

  const takePicture = () => {
    fileInput.current?.click();
  };
  const onFileInputChange = () => {
    uploadService.sendFile(roomId, new FormData(fileForm.current)).catch(() => {
      toast.error('Failed to upload');
    });
  };

  return (
    <div className={classnames(utilStyles.container, utilStyles.flexColumn)}>
      <BottomBar
        micState={micState}
        roomClient={roomClient}
        canChangeWebcam={canChangeWebcam}
        takePicture={takePicture}
        peersCount={peersCount}
        toggleCam={toggleCam}
        toggleMic={toggleMic}
        setGalleryOpen={setGalleryOpen}
        webcamState={webcamState}
        setParticipantsOpen={setParticipantsOpen}
      />

      <Peers />
      <Me />
      <div style={{ height: '66px' }} />
      <form method='post' encType='multipart/form-data' style={{ display: 'none' }} ref={fileForm}>
        <input
          type='file'
          name='sampleFile'
          ref={fileInput}
          onChange={onFileInputChange}
          accept='image/*'
        />
        <input type='submit' value='Upload!' />
      </form>
      <Sheet isOpen={isGalleryOpen} onClose={() => setGalleryOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Uploads />
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
