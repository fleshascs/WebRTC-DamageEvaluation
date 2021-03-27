import Layout from "../../components/layout";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { TopBar } from "../../components/TopBar";
import { Video } from "../../components/Video";
import roomStyles from "../../styles/room.module.css";
import { Button } from "../../components/Button";
import classnames from "classnames";

const Room: React.FC = () => {
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
