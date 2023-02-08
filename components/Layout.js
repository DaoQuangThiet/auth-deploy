import React from "react";

// import header footer all pages
import AddHead from "./AddHead";
import SideBarTop from "./sidebar";
import HeaderMid from "./HeaderMid";
import HeaderCenter from "./HeaderCenter";
import Footer from "./Footer";
import Copyright from "./Copyright";
import { AppProvider } from "../libs/context/AppContext";
import { ApolloProvider } from "@apollo/client";
import client from "../libs/apollo/ApolloClient";

const Layout = (props) => {
  return (
    <AppProvider>
      <ApolloProvider client={client}>
        <div>
          <AddHead />
          <SideBarTop />
          <HeaderMid />
          <HeaderCenter />
          {props.children}
          <Footer />
          <Copyright />
        </div>
      </ApolloProvider>
    </AppProvider>
  );
};
export default Layout;
