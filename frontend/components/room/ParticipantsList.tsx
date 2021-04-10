import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import { List, ListDivider } from '../List';
import { Container, Title } from '../List/ListItem';
import utilStyles from '../../styles/utils.module.css';
import styles from './room.module.css';
import { useSelector } from 'react-redux';
import {
  getPeers,
  getMicAncCamEnabled,
  getMe,
  getWebcamState,
  getMicState,
  getVideoProducer,
  getAudioProducer
} from '../../redux/selectors';

interface ParticipantsListProps {
  roomId: string;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ roomId }) => {
  const peers = useSelector(getPeers);
  const me = useSelector(getMe);
  const audioProducer = useSelector(getAudioProducer);
  const videoProducer = useSelector(getVideoProducer);
  const micState = getMicState(me, audioProducer);
  const webcamState = getWebcamState(me, videoProducer);

  const getMicAncCam = useSelector(getMicAncCamEnabled);
  return (
    <>
      <div className={styles.spacedRow}>
        <h3>Participants</h3>
        <Link href={`/room/${roomId}/addParticipant`}>
          <a className={utilStyles.link}>Add participant</a>
        </Link>
      </div>
      <List>
        <Participant
          key={me.displayName}
          displayName={me.displayName}
          micEnabled={micState === 'on'}
          webCamEnabled={webcamState === 'on'}
          showDivider={!!Object.keys(peers).length}
        />
        {Object.values(peers).map((peer, index) => {
          const [micEnabled, webCamEnabled] = getMicAncCam(peer);
          return (
            <Participant
              key={peer.displayName}
              displayName={peer.displayName}
              micEnabled={micEnabled}
              webCamEnabled={webCamEnabled}
              showDivider={index + 1 < Object.keys(peers).length}
            />
          );
        })}
      </List>
    </>
  );
};

interface ParticipantProps {
  displayName: string;
  webCamEnabled: boolean;
  micEnabled: boolean;
  showDivider: boolean;
}

export const Participant: React.FC<ParticipantProps> = (props) => {
  const { displayName, webCamEnabled, micEnabled, showDivider } = props;
  return (
    <React.Fragment>
      <Container>
        <Title title={displayName} />
        <div>
          <span
            className={classnames('material-icons', styles.listIcon, {
              [styles.disabledButton]: !micEnabled
            })}
          >
            {micEnabled ? 'mic' : 'mic_off'}
          </span>

          <span
            className={classnames('material-icons', styles.listIcon, {
              [styles.disabledButton]: !webCamEnabled
            })}
          >
            {webCamEnabled ? 'videocam' : 'videocam_off'}
          </span>
        </div>
      </Container>
      {showDivider ? <ListDivider /> : null}
    </React.Fragment>
  );
};
