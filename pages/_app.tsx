import { AppProps } from "next/dist/next-server/lib/router/router";
import React from "react";
import Layout from "../components/Layout";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default MyApp;

// medium code block
