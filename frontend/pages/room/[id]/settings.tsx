import Head from 'next/head';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import utilStyles from '../../../styles/utils.module.css';
import { TopBar } from '../../../components/TopBar';
import { useRoom } from '../../../components/room/hooks';
import { ListItem, List, ListDivider } from '../../../components/List';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { participantService } from '../../../services';
import { Participant } from '../../../services/types';
import React from 'react';

const Settings: React.FC = () => {
  const router = useRouter();
  const roomId = parseInt(router.query.id as string);
  const [room, isLoading, failed] = useRoom(roomId);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const getParticipants = useCallback(async (roomId) => {
    const participants = await participantService.getAll(roomId);
    setParticipants(participants);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    getParticipants(roomId);
  }, [router.isReady]);

  return (
    <Layout>
      <Head>
        <title>room settings</title>
      </Head>
      <TopBar title='room settings' />
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
        <h3>Participants</h3>
        <Link href={`/room/${roomId}/addParticipant`}>
          <a className={utilStyles.link}>Add participant</a>
        </Link>
        <List>
          {participants
            ? participants.map((participant, index) => (
                <React.Fragment key={participant.id}>
                  <ListItem
                    title={participant.account.firstName + ' ' + participant.account.lastName}
                  />
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
