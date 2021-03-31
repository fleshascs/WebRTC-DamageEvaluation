import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import { TopBar } from "../../components/TopBar";
import { roomService } from "../../services";
import { useRouter } from "next/router";

const CreateRoom: React.FC = () => {
  const router = useRouter();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const initialValues = {
    roomName: "",
    scheduledFor: "",
  };

  const validationSchema = Yup.object().shape({
    roomName: Yup.string().required("Room name is required"),
    scheduledFor: Yup.string().required("date is required"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    fields.scheduledFor = new Date(fields.scheduledFor).toUTCString();
    console.log("fields", fields);
    roomService
      .create(fields)
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
        <title>Create room</title>
      </Head>
      <TopBar title="Create room" />
      {showVerificationMessage ? (
        <div>Room crated successfully</div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <h3 className="card-header">Create room</h3>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-group col-5">
                    <label>Room name</label>
                    <Field
                      name="roomName"
                      type="text"
                      className={
                        "form-control" +
                        (errors.roomName && touched.roomName
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="roomName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group col-5">
                    <label>Scheduled for</label>
                    <Field
                      name="scheduledFor"
                      type="datetime-local"
                      className={
                        "form-control" +
                        (errors.scheduledFor && touched.scheduledFor
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="scheduledFor"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
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
                    create
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default CreateRoom;
