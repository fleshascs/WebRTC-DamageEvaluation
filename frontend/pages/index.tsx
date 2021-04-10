import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { List, ListDivider, ListItem } from '../components/List';
import { PWAButton } from '../components/PWAButton';
import { useEffect, useRef } from 'react';
import { TopBar } from '../components/TopBar';
import { GoogleButton } from '../components/GoogleButton';
import homeStyles from '../styles/home.module.css';
import classnames from 'classnames';

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TopBar backButton={false} title='Damage Evaluation' />
      <div className={classnames(utilStyles.container, utilStyles.center)}>
        {/* <img src="/images/sssss_iphone12black_portrait.png" width="150" /> */}
        <div className={utilStyles.center}>
          <div className={homeStyles.loginButtons}>
            {/* <Link href={`/login`}>
              <GoogleButton>Sign in with Google</GoogleButton>
            </Link> */}
            <Link href={`/login`}>
              <a className={homeStyles.loginButton}>Sign in</a>
            </Link>
            <PWAButton />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  };
}
