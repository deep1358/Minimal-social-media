import { useEffect } from "react";
import Navbar from "./Navbar";
import { injectStyle } from "react-toastify/dist/inject-style";

const Layout = ({ children }) => {
  useEffect(() => {
    injectStyle();
  });

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
