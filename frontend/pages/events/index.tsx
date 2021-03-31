import Head from "next/head";
import classnames from "classnames";
import Layout, { siteTitle } from "../../components/layout";
import { List, ListDivider, ListItem } from "../../components/List";
import { TopBar } from "../../components/TopBar";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { useUser } from "../../components/auth/hooks";
import Link from "next/link";
import { useRooms } from "../../components/room/hooks";
import React from "react";

const Events: React.FC = () => {
  const [rooms, isLoading, failed] = useRooms();
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TopBar title="Events" />
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
        <Link href="/room/create">
          <a>Create room</a>
        </Link>
        {isLoading ? "loading..." : null}
        {failed ? "failed to load" : null}
        <List>
          {rooms
            ? rooms.map((room, index) => (
                <React.Fragment key={room.roomName}>
                  <ListItem
                    live={true}
                    title={room.roomName}
                    subText={
                      <>
                        Date: <Date dateString={room.scheduledFor} />
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
