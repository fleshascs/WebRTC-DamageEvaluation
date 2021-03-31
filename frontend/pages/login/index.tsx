import Head from "next/head";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Link from "next/link";
import Date from "../../components/date";
import { TopBar } from "../../components/TopBar";
import { accountService } from "../../services";

const Login: React.FC = () => {
  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  function onSubmit({ email, password }, { setSubmitting }) {
    //alertService.clear();
    accountService
      .login(email, password)
      .then(() => {
        // const { from } = location.state || { from: { pathname: "/" } };
        //history.push(from);

        router.push("/events");
      })
      .catch((error) => {
        setSubmitting(false);
        console.log(error);

        // alertService.error(error);
      });
  }

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <TopBar title="Login" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <h3 className="card-header">Login</h3>
            <div className="card-body">
              <div className="form-group">
                <label>Email</label>
                <Field
                  name="email"
                  type="text"
                  className={
                    "form-control" +
                    (errors.email && touched.email ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  className={
                    "form-control" +
                    (errors.password && touched.password ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting && (
                      <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    Login
                  </button>
                  <Link href="/register">
                    <a className="btn btn-link">Register</a>
                  </Link>
                </div>
                <div className="form-group col text-right">
                  <Link href="/account/forgot-password">
                    <a className="btn btn-link pr-0"> Forgot Password?</a>
                  </Link>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default Login;
