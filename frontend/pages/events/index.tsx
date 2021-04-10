import Head from 'next/head';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import classnames from 'classnames';
import Layout, { siteTitle } from '../../components/layout';
import { List, ListDivider, ListItem } from '../../components/List';
import { TopBar } from '../../components/TopBar';
import DateComponent from '../../components/date';
import utilStyles from '../../styles/utils.module.css';
import Link from 'next/link';
import { useRooms } from '../../components/room/hooks';
import { differenceInMinutes } from 'date-fns';

function isLive(scheduledFor: string) {
  const diffInMinutes = differenceInMinutes(new Date(), new Date(scheduledFor));
  return diffInMinutes >= 0 && diffInMinutes < 20;
}

const Events: React.FC = () => {
  const [rooms, isLoading, failed] = useRooms();
  const [isEventLive, setIsEventLive] = useState({});
  const isLiveTask = useRef<NodeJS.Timeout>();

  const setStatuses = useCallback(() => {
    if (!rooms) return;
    const statuses = rooms.reduce((statuses, room) => {
      statuses[room.id] = isLive(room.scheduledFor);
      return statuses;
    }, {});
    setIsEventLive(statuses);
  }, [rooms]);

  useEffect(() => {
    setStatuses();
    isLiveTask.current = setInterval(setStatuses, 1000 * 60);
    return () => clearInterval(isLiveTask.current);
  }, [rooms]);
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TopBar title='Events' />
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
        <Link href='/room/create'>
          <a className={utilStyles.link}>Create a room</a>
        </Link>
        <div className={utilStyles.mt1}></div>
        {isLoading ? 'loading...' : null}
        {failed ? 'failed to load' : null}
        {!isLoading && !failed && !rooms?.length ? (
          <div className={classnames(utilStyles.footerText, utilStyles.mt1)}>
            Event list is empty, create one by yourself or ask administrator to schedule one.
          </div>
        ) : null}
        <List>
          {rooms
            ? rooms.map((room, index) => (
                <React.Fragment key={room.id}>
                  <ListItem
                    live={isEventLive[room.id]}
                    title={room.roomName}
                    subText={
                      <>
                        Date: <DateComponent dateString={room.scheduledFor} />
                      </>
                    }
                    url={`/room/${room.id}`}
                  />
                  {index + 1 < rooms.length ? <ListDivider /> : null}
                </React.Fragment>
              ))
            : null}
        </List>
      </div>
    </Layout>
  );
};

export default Events;
