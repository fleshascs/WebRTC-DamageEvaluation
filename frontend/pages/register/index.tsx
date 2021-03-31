import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import { TopBar } from "../../components/TopBar";
import { accountService } from "../../services";
import { useRouter } from "next/router";

const Register: React.FC = () => {
  const router = useRouter();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    acceptTerms: Yup.bool().oneOf(
      [true],
      "Accept Terms & Conditions is required"
    ),
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
      <TopBar title="Register" />
      {showVerificationMessage ? (
        <div>
          Registration successful, please check your email for verification
          instructions
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <h3 className="card-header">Register</h3>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-group col-5">
                    <label>First Name</label>
                    <Field
                      name="firstName"
                      type="text"
                      className={
                        "form-control" +
                        (errors.firstName && touched.firstName
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group col-5">
                    <label>Last Name</label>
                    <Field
                      name="lastName"
                      type="text"
                      className={
                        "form-control" +
                        (errors.lastName && touched.lastName
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
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
                <div className="form-row">
                  <div className="form-group col">
                    <label>Password</label>
                    <Field
                      name="password"
                      type="password"
                      className={
                        "form-control" +
                        (errors.password && touched.password
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group col">
                    <label>Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className={
                        "form-control" +
                        (errors.confirmPassword && touched.confirmPassword
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <div className="form-group form-check">
                  <Field
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    className={
                      "form-check-input " +
                      (errors.acceptTerms && touched.acceptTerms
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <label htmlFor="acceptTerms" className="form-check-label">
                    Accept Terms & Conditions
                  </label>
                  <ErrorMessage
                    name="acceptTerms"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting && (
                      <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    Register
                  </button>
                  <Link href="/login">
                    <a className="btn btn-link">Cancel</a>
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default Register;
