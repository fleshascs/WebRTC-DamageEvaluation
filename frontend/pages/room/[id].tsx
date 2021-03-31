import Layout from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { TopBar } from "../../components/TopBar";
import { Video } from "../../components/Video";
import roomStyles from "../../styles/room.module.css";
import { Button } from "../../components/Button";
import classnames from "classnames";
import { useRoom } from "../../components/room/hooks";
import { useRouter } from "next/router";
import Link from "next/link";

const Room: React.FC = () => {
  const router = useRouter();
  const roomId = router.query.id;
  const [room, isLoading, failed] = useRoom(parseInt(roomId as string));
  console.log("room", room);
  console.log("roomId", roomId);

  return (
    <Layout>
      <Head>
        <title>room</title>
      </Head>
      <TopBar title="Car insurance" />
      <div className={utilStyles.container}>
        <div className={roomStyles.videoContainer}>
          <Video />
        </div>
        {!room ? "no room data" : null}
        {isLoading ? "isLoading" : null}
        {failed ? "failed" : null}
        <div className={roomStyles.videosContainer}>
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
        </div>

        <div className={classnames(utilStyles.p1, roomStyles.buttonsContainer)}>
          <Button onClick={() => {}} className={roomStyles.button}>
            <img src="/icons/add_a_photo-black-18dp.svg" alt="take a picture" />
          </Button>

          <Button onClick={() => {}} className={roomStyles.button}>
            <img src="/icons/videocam-black-18dp.svg" alt="record" />
          </Button>
          <Link href={`/room/${roomId}/settings`}>
            <Button component="div" className={roomStyles.button}>
              <img src="/icons/manage_accounts-24px.svg" alt="record" />
            </Button>
          </Link>
        </div>

        <div className={roomStyles.attachmentsContainer}>
          <div className={roomStyles.attachment}></div>
          <div className={roomStyles.attachment}></div>
          <div className={roomStyles.attachment}></div>
          <div className={roomStyles.attachment}></div>
          <div className={roomStyles.attachment}></div>
        </div>
      </div>
    </Layout>
  );
};
export default Room;
