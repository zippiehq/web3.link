import React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import loadable from "@loadable/component";

import Box from "@material-ui/core/Box";
import { theme } from "@zippie/components";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

const HomeView = loadable(() =>
  import(
    /* webpackChunkName: "HomeView", webpackPrefetch: 1 */ "./HomeView.jsx"
  )
);

const App = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        overflowY="auto"
        minHeight="100vh"
        bgcolor={"white"}
      >
        <Header />
        <Box
          display="flex"
          flexDirection="column"
          flexGrow="2"
          pl="8%"
          pr="8%"
          pt={4}
        >
          <Switch>
            <Route exact path="/" render={(props) => <HomeView {...props} />} />
          </Switch>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default (props) => (
  <Router basename={"/"}>
    <App {...props} />
  </Router>
);
