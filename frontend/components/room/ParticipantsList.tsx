import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import { List, ListDivider } from '../List';
import { Container, Title } from '../List/ListItem';
import utilStyles from '../../styles/utils.module.css';
import styles from './room.module.css';
import { useSelector } from 'react-redux';
import { getPeers, getMicAncCamEnabled, getMe } from '../../redux/selectors';

interface ParticipantsListProps {
  roomId: string;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ roomId }) => {
  const peers = useSelector(getPeers);
  const me = useSelector(getMe);
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
        {Object.values(peers).map((peer, index) => {
          const [micEnabled, webCamEnabled] = getMicAncCam(peer);
          return (
            <React.Fragment key={peer.displayName}>
              <Container>
                <Title title={peer.displayName} />
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
              {index + 1 < Object.keys(peers).length ? <ListDivider /> : null}
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
};
