import React,{ useState }  from "react";
import Head from "next/head";
import classnames from "classnames";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import utilStyles from "../../../styles/utils.module.css";
import { TopBar } from "../../../components/TopBar";
import { useRoom } from "../../../components/room/hooks";
import { ListItem, List, ListDivider } from "../../../components/List";
import { participantService, accountService } from "../../../services";
import { User } from "../../../services/types";

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
      <TopBar title="Add participants" />
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
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
                  <ListItem
                    title={participant.firstName + " " + participant.lastName}
                    onClick={() => {
                      const i = participants.findIndex(
                        (p) => p.id === participant.id
                      );
                      participants[i].inRoom = true;
                      setParticipants([...participants]);
                      participantService.add(roomId, [participant.id]);
                    }}
                    buttonText={participant.inRoom ? null : "add"}
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
