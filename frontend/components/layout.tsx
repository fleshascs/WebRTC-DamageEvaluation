import { ReactNode } from 'react';
import Head from 'next/head';
import classnames from 'classnames';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import { Toaster } from 'react-hot-toast';

export const siteTitle = 'Next.js Sample Website';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={classnames(styles.container, className)}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Learn how to build a personal website using Next.js' />
        <meta
          property='og:image'
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
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
