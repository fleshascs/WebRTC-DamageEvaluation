import Head from 'next/head';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import classnames from 'classnames';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Link from 'next/link';
import Date from '../../components/date';
import { TopBar } from '../../components/TopBar';
import { accountService } from '../../services';
import utilStyles from '../../styles/utils.module.css';
import loginStyles from '../../styles/login.module.css';

const Login: React.FC = () => {
  const router = useRouter();
  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  function onSubmit({ email, password }, { setSubmitting }) {
    //alertService.clear();
    accountService
      .login(email, password)
      .then(() => {
        // const { from } = location.state || { from: { pathname: "/" } };
        //history.push(from);

        router.push('/events');
      })
      .catch((error) => {
        setSubmitting(false);

        // alertService.error(error);
      });
  }

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <TopBar title='Login' />
      <div className={classnames(utilStyles.p1, utilStyles.container, utilStyles.container400)}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
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

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={classnames(utilStyles.link, utilStyles.mt1, loginStyles.button)}
                >
                  {isSubmitting || (true && <span></span>)}
                  Login
                </button>

                <div className={classnames(loginStyles.row, utilStyles.mt1)}>
                  <Link href='/register'>
                    <a>Register</a>
                  </Link>

                  <Link href='/account/forgot-password'>
                    <a className='btn btn-link pr-0'> Forgot Password?</a>
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default Login;
