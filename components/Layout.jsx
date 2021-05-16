import { useEffect } from "react";
import Navbar from "./Navbar";
import Notify from "./Notify";
import { injectStyle } from "react-toastify/dist/inject-style";

const Layout = ({ children }) => {
  useEffect(() => {
    injectStyle();
  });

  return (
    <>
      <Navbar />
      {/* <Notify /> */}
      {children}
    </>
  );
};

export default Layout;
