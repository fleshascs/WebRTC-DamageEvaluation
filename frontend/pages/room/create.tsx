import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import classnames from "classnames";
import * as Yup from "yup";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import { TopBar } from "../../components/TopBar";
import { roomService } from "../../services";
import { useRouter } from "next/router";
import utilStyles from "../../styles/utils.module.css";

interface CreateRoomFields {
  roomName: string;
  scheduledFor: string;
}

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

  function onSubmit(fields: CreateRoomFields, { setStatus, setSubmitting }) {
    setStatus();
    fields.scheduledFor = new Date(fields.scheduledFor).toUTCString();
    console.log("fields", fields);
    roomService
      .create(fields)
      .then((room) => {
        setShowVerificationMessage(true);
        console.log(
          ' "Registration successful, please check your email for verification instructions"'
        );
        console.log("room", room);

        router.push(`/room/${room.id}/addParticipant`);
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
      <div className={classnames(utilStyles.p1, utilStyles.container)}>
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
                <div className="card-body">
                  <div className="form-row">
                    <div className="form-group col-5">
                      <label>Room name</label>
                      <Field
                        name="roomName"
                        type="text"
                        className={classnames(
                          utilStyles.input,
                          errors.roomName && touched.roomName
                            ? " is-invalid"
                            : ""
                        )}
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
                        className={classnames(
                          utilStyles.input,
                          errors.scheduledFor && touched.scheduledFor
                            ? " is-invalid"
                            : ""
                        )}
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
                      className={utilStyles.link}
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
      </div>
    </Layout>
  );
};

export default CreateRoom;
