import { ReactNode } from 'react';
import Head from 'next/head';
import classnames from 'classnames';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import { Toaster } from 'react-hot-toast';

export const siteTitle = 'Damage Evaluation';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={classnames(styles.container, className)}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Application built for evaluating damage' />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <Toaster />
      <header className={styles.header}></header>
      <main className={utilStyles.flexColumn}>{children}</main>
    </div>
  );
};

export default Layout;
