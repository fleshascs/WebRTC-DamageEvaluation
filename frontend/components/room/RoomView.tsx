import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.css';
import { Video } from '../../components/Video';
import roomStyles from '../../styles/room.module.css';
import { Button } from '../../components/Button';
import { useRoom } from '../../components/room/hooks';
import RoomContext from '../../components/room/RoomContext';
import { getRoom, getMe, getAmActiveSpeaker } from '../../redux/selectors';
import Peers from './Peers';
import Me from './Me';

interface RoomViewProps {
  roomInfo: any;
  isLoading: boolean;
  failed: boolean;
  roomId: string;
}

export const RoomView: React.FC<RoomViewProps> = (props) => {
  const { roomInfo, isLoading, failed, roomId } = props;
  const router = useRouter();
  const roomClient = useContext(RoomContext);
  const room = useSelector(getRoom);
  const me = useSelector(getMe);
  const amActiveSpeaker = useSelector(getAmActiveSpeaker);

  useEffect(() => {
    if (roomClient) {
      console.log('-------JOIN ROOM');
      roomClient.join();
    }
  }, [roomClient]);

  if (isLoading) return <div className={utilStyles.container}>Loading...</div>;
  if (failed) return <div className={utilStyles.container}>Technical Error, please try later</div>;

  console.log('roomInfo', roomInfo);

  return (
    <>
      <div className={classnames(utilStyles.container, utilStyles.flexColumn)}>
        {/* <div className={roomStyles.videoContainer}>
          <Video />
        </div> */}

        {/* {!roomInfo ? 'no room data' : null}
        {isLoading ? 'isLoading' : null}
        {failed ? 'failed' : null} */}

        <Me />
        <Peers />
        {/* <div style={{ flex: 1, backgroundColor: 'red' }}>asd</div> */}

        {/* <div className={roomStyles.videosContainer}>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
            <div className={roomStyles.videoThumbnail}>
              <Video />
            </div>
          </div> */}

        <div className={classnames(utilStyles.p1, roomStyles.buttonsContainer)}>
          <Button onClick={() => {}} className={roomStyles.button}>
            <img src='/icons/add_a_photo-black-18dp.svg' alt='take a picture' />
          </Button>

          {/* <Button onClick={() => {}} className={roomStyles.button}>
            <img src='/icons/videocam-black-18dp.svg' alt='record' />
          </Button> */}
          <Link href={`/room/${roomId}/settings`}>
            <Button component='div' className={roomStyles.button}>
              <img src='/icons/manage_accounts-24px.svg' alt='record' />
            </Button>
          </Link>
        </div>

        {/* <div className={roomStyles.attachmentsContainer}>
            <div className={roomStyles.attachment}></div>
            <div className={roomStyles.attachment}></div>
            <div className={roomStyles.attachment}></div>
            <div className={roomStyles.attachment}></div>
            <div className={roomStyles.attachment}></div>
          </div> */}
      </div>
    </>
  );
};
