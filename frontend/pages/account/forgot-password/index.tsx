import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import classnames from 'classnames';
import * as Yup from 'yup';
import { accountService } from '../../../services';
import Link from 'next/link';
import Layout from '../../../components/layout';
import Head from 'next/head';
import { TopBar } from '../../../components/TopBar';
import utilStyles from '../../../styles/utils.module.css';

const ForgotPassword: React.FC = () => {
  const initialValues = {
    email: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required')
  });

  function onSubmit({ email }, { setSubmitting }) {
    // alertService.clear();
    accountService
      .forgotPassword(email)
      .then(() => {
        // alertService.success(
        //   "Please check your email for password reset instructions"
        // )
        console.log('Please check your email for password reset instructions');
      })
      .catch((error) => console.log(error))
      .finally(() => setSubmitting(false));
  }

  return (
    <Layout>
      <Head>
        <title>Forgot password</title>
      </Head>
      <TopBar title='Forgot password' />
      <div className={classnames(utilStyles.p1, utilStyles.container, utilStyles.container400)}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <h3 className='card-header'>Forgot Password</h3>
              <div className='card-body'>
                <div className='form-group'>
                  <label>Email</label>
                  <Field
                    name='email'
                    type='text'
                    className={classnames(
                      utilStyles.input,
                      errors.email && touched.email ? ' is-invalid' : ''
                    )}
                  />
                  <ErrorMessage name='email' component='div' className={utilStyles.errorText} />
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className={classnames(utilStyles.link, utilStyles.mt1)}
                    >
                      {isSubmitting && (
                        <span className='spinner-border spinner-border-sm mr-1'></span>
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
