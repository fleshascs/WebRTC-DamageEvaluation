import Head from "next/head";
import Layout, { siteTitle } from "../../components/layout";
import Link from "next/link";
import Date from "../../components/date";
import { List, ListDivider, ListItem } from "../../components/List";
import { TopBar } from "../../components/TopBar";
import utilStyles from "../../styles/utils.module.css";
import classnames from "classnames";

const Events: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TopBar title="Events" />
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
        <List>
          <ListItem
            live={true}
            title="Ford Transit Car insurance"
            subText="Date: 2021-03-23 13:45"
            url={`/room/1`}
          />
          <ListDivider />
          <ListItem
            live={false}
            title="Samsung Galaxy S10 Plus insurance"
            subText="Date: 2021-03-23 13:45"
            url={`/room/1`}
          />
          <ListDivider />
          <ListItem
            live={false}
            title="iPhone 6s insurance"
            subText="Date: 2021-03-23 13:45"
            url={`/room/1`}
          />
        </List>
      </div>
    </Layout>
  );
};

export default Events;
