import Layout from "../components/Layout";
import { DataProvider } from "../store/GlobalState";
import "../styles/globals.css";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DataProvider>
        <ToastContainer />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataProvider>
    </>
  );
}

export default MyApp;
