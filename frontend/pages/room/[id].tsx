import { useRouter } from 'next/router';
import classnames from 'classnames';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import roomStyles from '../../styles/room.module.css';
import { TopBar } from '../../components/TopBar';
import { useRoom } from '../../components/room/hooks';
import Layout from '../../components/layout';
import { RoomWrapper, RoomView } from '../../components/room';

const Room: React.FC = () => {
  const router = useRouter();
  const roomId = router.query.id as string;
  const [roomInfo, isLoading, failed] = useRoom(parseInt(roomId));

  return (
    <RoomWrapper roomId={roomId}>
      <Layout className={classnames(roomStyles.container, utilStyles.flexColumn)}>
        <Head>
          <title>room</title>
        </Head>
        <TopBar title={roomInfo ? roomInfo.roomName : ''} />
        <div className={classnames(utilStyles.container, utilStyles.flexColumn)}>
          <RoomView roomInfo={roomInfo} isLoading={isLoading} failed={failed} roomId={roomId} />
        </div>
      </Layout>
    </RoomWrapper>
  );
};
export default Room;
