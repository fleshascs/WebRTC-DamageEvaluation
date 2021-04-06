import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { accountService } from '../../../services';
import Head from 'next/head';
import Layout from '../../../components/layout';
import { TopBar } from '../../../components/TopBar';
import utilStyles from '../../../styles/utils.module.css';

const VerifyEmail: React.FC = () => {
  const router = useRouter();

  const EmailStatus = {
    Verifying: 'Verifying',
    Failed: 'Failed'
  };

  const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

  useEffect(() => {
    const { token } = router.query;
    if (!token) return;

    // remove token from url to prevent http referer leakage
    // router.push(location.pathname);

    accountService
      .verifyEmail(token)
      .then(() => {
        console.log('Verification successful, you can now login');

        // alertService.success("Verification successful, you can now login", {
        //   keepAfterRouteChange: true,
        // });
        router.push('/login');
      })
      .catch(() => {
        setEmailStatus(EmailStatus.Failed);
      });
  }, [router.query]);

  function getBody() {
    switch (emailStatus) {
      case EmailStatus.Verifying:
        return <div>Verifying...</div>;
      case EmailStatus.Failed:
        return (
          <div>
            Verification failed, you can also verify your account using the{' '}
            <Link href='/forgot-password'>
              <a>forgot password</a>
            </Link>{' '}
            page.
          </div>
        );
    }
  }

  return (
    <Layout>
      <Head>
        <title>Verify Email</title>
      </Head>
      <TopBar title='Verify Email' />
      <div className={classnames(utilStyles.p1, utilStyles.container, utilStyles.container400)}>
        <h3 className='card-header'>Verify Email</h3>
        <div className='card-body'>{getBody()}</div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
