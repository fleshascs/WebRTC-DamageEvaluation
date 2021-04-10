import Head from 'next/head';
import Image from 'next/image';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { PWAButton } from '../components/PWAButton';
import { TopBar } from '../components/TopBar';
import { GoogleButton } from '../components/GoogleButton';
import homeStyles from '../styles/home.module.css';
import classnames from 'classnames';
import { useUser } from '../components/auth/hooks';

export default function Home() {
  const user = useUser();

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TopBar backButton={false} title='Damage Evaluation' />

      <div className={classnames(utilStyles.container, utilStyles.p1, utilStyles.center)}>
        <div className={utilStyles.center}>
          <div>
            <h1>Video meetings &amp; damage evaluation</h1>
            <p>
              Schedule a private meeting with your insurance worker to evaluate your damaged
              belongings...
            </p>
          </div>
          <div className={homeStyles.loginButtons}>
            <Link href={user ? '/events' : '/login'}>
              <a className={classnames(homeStyles.loginButton, homeStyles.homeButton)}>
                Go to the events
              </a>
            </Link>

            <PWAButton />
          </div>
          <Image
            src='/images/rsz_events2_iphone12black_portrait.png'
            width='300'
            height='567'
            alt='events'
          />
        </div>
      </div>
    </Layout>
  );
}
