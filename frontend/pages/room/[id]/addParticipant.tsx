import React, { useState } from 'react';
import Head from 'next/head';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import utilStyles from '../../../styles/utils.module.css';
import { TopBar } from '../../../components/TopBar';
import { useRoom } from '../../../components/room/hooks';
import { ListItem, List, ListDivider } from '../../../components/List';
import { participantService, accountService } from '../../../services';
import styles from '../../../components/room/room.module.css';
import { User } from '../../../services/types';
import { ParticipantsListItem } from '../../../components/List/ParticipantsListItem';
import Link from 'next/link';

type RoomParticipant = User & { inRoom: boolean };

const Settings: React.FC = () => {
  const router = useRouter();
  const roomId = parseInt(router.query.id as string);
  const [room, isLoading, failed] = useRoom(roomId);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);

  const handleSearch = async (e) => {
    const query = e.currentTarget.value;
    const participants = await accountService.getAll(roomId, query);
    setParticipants(participants);
  };

  return (
    <Layout>
      <Head>
        <title>Add participants</title>
      </Head>
      <TopBar title='Add participants' />
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
        <div className={styles.spacedRow}>
          <h3>Add participants</h3>
          <Link href={`/room/${roomId}`}>
            <a className={utilStyles.link}>Go to the room</a>
          </Link>
        </div>
        <input onChange={handleSearch} className={utilStyles.input} />
        {!participants || !participants?.length ? (
          <div className={classnames(utilStyles.footerText, utilStyles.mt1)}>
            Search for participants by entering the name in the search bar
          </div>
        ) : null}
        <List>
          {participants
            ? participants.map((participant, index) => (
                <React.Fragment key={participant.firstName}>
                  <ParticipantsListItem
                    title={participant.firstName + ' ' + participant.lastName}
                    onClick={() => {
                      const i = participants.findIndex((p) => p.id === participant.id);
                      participants[i].inRoom = true;
                      setParticipants([...participants]);
                      participantService.add(roomId, [participant.id]);
                    }}
                    buttonText={participant.inRoom ? null : 'add'}
                  >
                    {participant.inRoom ? (
                      <span className={utilStyles.footerText}>invited</span>
                    ) : null}
                  </ParticipantsListItem>

                  {index + 1 < participants.length ? <ListDivider /> : null}
                </React.Fragment>
              ))
            : null}
        </List>
      </div>
    </Layout>
  );
};
export default Settings;
