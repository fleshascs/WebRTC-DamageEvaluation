import Head from "next/head";
import Layout, { siteTitle } from "../../components/layout";
import Link from "next/link";
import Date from "../../components/date";
import { List, ListDivider, ListItem } from "../../components/List";
import { TopBar } from "../../components/TopBar";

const Login: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <TopBar title="Login" />
      <Link href={`/events`}>Sign in with Google</Link>
    </Layout>
  );
};

export default Login;
