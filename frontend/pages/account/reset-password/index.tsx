import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { accountService } from '../../../services';
import Layout from '../../../components/layout';
import Head from 'next/head';
import { TopBar } from '../../../components/TopBar';
import utilStyles from '../../../styles/utils.module.css';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ResetPassword: React.FC = () => {
  const TokenStatus = {
    Validating: 'Validating',
    Valid: 'Valid',
    Invalid: 'Invalid'
  };
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);

  useEffect(() => {
    const { token } = router.query;
    accountService
      .validateResetToken(token)
      .then(() => {
        setToken(token);
        setTokenStatus(TokenStatus.Valid);
      })
      .catch(() => {
        setTokenStatus(TokenStatus.Invalid);
      });
  }, []);

  function getForm() {
    const initialValues = {
      password: '',
      confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    });

    function onSubmit({ password, confirmPassword }, { setSubmitting }) {
      accountService
        .resetPassword({ token, password, confirmPassword })
        .then(() => {
          toast.success('Password reset successful, you can now login');
          router.push('/login');
        })
        .catch((error) => {
          setSubmitting(false);
          toast.error(error);
        });
    }

    return (
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className='form-group'>
              <label>Password</label>
              <Field
                name='password'
                type='password'
                className={classnames(
                  utilStyles.input,
                  errors.password && touched.password ? ' is-invalid' : ''
                )}
              />
              <ErrorMessage name='password' component='div' className={utilStyles.errorText} />
            </div>
            <div className='form-group'>
              <label>Confirm Password</label>
              <Field
                name='confirmPassword'
                type='password'
                className={classnames(
                  utilStyles.input,
                  errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : ''
                )}
              />
              <ErrorMessage
                name='confirmPassword'
                component='div'
                className={utilStyles.errorText}
              />
            </div>
            <div className='form-row'>
              <div className='form-group col'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={classnames(utilStyles.link, utilStyles.mt1)}
                >
                  {isSubmitting && <span className='spinner-border spinner-border-sm mr-1'></span>}
                  Reset Password
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  function getBody() {
    switch (tokenStatus) {
      case TokenStatus.Valid:
        return getForm();
      case TokenStatus.Invalid:
        return (
          <div>
            Token validation failed, if the token has expired you can get a new one at the{' '}
            <Link href='/forgot-password'>forgot password</Link> page.
          </div>
        );
      case TokenStatus.Validating:
        return <div>Validating token...</div>;
    }
  }

  return (
    <Layout>
      <Head>
        <title>Reset Password</title>
      </Head>
      <TopBar title='Reset Password' />
      <div className={classnames(utilStyles.p1, utilStyles.container, utilStyles.container400)}>
        <div className='card-body'>{getBody()}</div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
