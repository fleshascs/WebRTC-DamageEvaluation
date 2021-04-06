import React, { useState } from 'react';
import classnames from 'classnames';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import { TopBar } from '../../components/TopBar';
import { accountService } from '../../services';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.css';
import loginStyles from '../../styles/login.module.css';

const Register: React.FC = () => {
  const router = useRouter();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const initialValues = {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required')
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    accountService
      .register(fields)
      .then(() => {
        setShowVerificationMessage(true);
        console.log(
          ' "Registration successful, please check your email for verification instructions"'
        );
      })
      .catch((error) => {
        setSubmitting(false);
        console.log(error);
      });
  }

  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>
      <TopBar title='Register' />
      <div className={classnames(utilStyles.p1, utilStyles.container, utilStyles.container400)}>
        {showVerificationMessage ? (
          <div>Registration successful, please check your email for verification instructions</div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className='card-body'>
                  <div className='form-row'>
                    <div className='form-group col-5'>
                      <label>First Name</label>
                      <Field
                        name='firstName'
                        type='text'
                        className={classnames(
                          utilStyles.input,
                          errors.firstName && touched.firstName ? ' is-invalid' : ''
                        )}
                      />
                      <ErrorMessage
                        name='firstName'
                        component='div'
                        className={utilStyles.errorText}
                      />
                    </div>
                    <div className='form-group col-5'>
                      <label>Last Name</label>
                      <Field
                        name='lastName'
                        type='text'
                        className={classnames(
                          utilStyles.input,
                          errors.lastName && touched.lastName ? ' is-invalid' : ''
                        )}
                      />
                      <ErrorMessage
                        name='lastName'
                        component='div'
                        className={utilStyles.errorText}
                      />
                    </div>
                  </div>
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
                      <label>Password</label>
                      <Field
                        name='password'
                        type='password'
                        className={classnames(
                          utilStyles.input,
                          errors.password && touched.password ? ' is-invalid' : ''
                        )}
                      />
                      <ErrorMessage
                        name='password'
                        component='div'
                        className={utilStyles.errorText}
                      />
                    </div>
                    <div className='form-group col'>
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
                  </div>
                  <div className={utilStyles.ph1}>
                    <Field
                      type='checkbox'
                      name='acceptTerms'
                      id='acceptTerms'
                      className={classnames(
                        'form-check-input',
                        errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : ''
                      )}
                    />
                    <label htmlFor='acceptTerms' className='form-check-label'>
                      Accept Terms & Conditions
                    </label>
                    <ErrorMessage
                      name='acceptTerms'
                      component='div'
                      className={utilStyles.errorText}
                    />
                  </div>
                  <div className='form-group'>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className={classnames(utilStyles.link, loginStyles.button)}
                    >
                      {isSubmitting && (
                        <span className='spinner-border spinner-border-sm mr-1'></span>
                      )}
                      Register
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
};

export default Register;
