import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useLocation, useHistory, Link } from "react-router-dom";
// import LohkoLogo from "../assets/logos/lohko-logo.svg";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  header: {
    zIndex: theme.zIndex.modal + 1,
    backgroundColor: "white",
    boxShadow: "0 1px 0 0 rgba(45, 30, 70, 0.1)",
  },
  bar: {
    paddingLeft: "8%",
    paddingRight: "8%",

    minHeight: "70px",
  },
  toolbar: theme.mixins.toolbar,
  link: {
    textDecoration: "none",
    color: "inherit",
    marginLeft: theme.spacing(5),
  },
}));

const LinkComponent = ({ title, path }) => {
  const classes = useStyles();
  const location = useLocation();

  const isSelected = location.pathname === path;
  return (
    <Typography
      color="textPrimary"
      style={{ fontWeight: isSelected ? "500" : "400" }}
    >
      <Link to={path} className={classes.link}>
        {title}
      </Link>
    </Typography>
  );
};

const NavHeader = () => {
  const handleUserAuthentication = async (type) => {
    await signUpWithZippie(type);
  };
  return (
    <>
      <img src={""} style={{ marginRight: "16px" }} alt="" />
      <LinkComponent title="Home" path="/" />
      <LinkComponent title="Portfolio" path="/portfolio" />

      <>
        <Button
          fullWidth={false}
          variant="outlined"
          style={{
            marginLeft: "auto",
            borderRadius: "0",
            borderColor: "#637381",
            color: "#637381",
          }}
          onClick={() => handleUserAuthentication("signIn")}
        >
          Sign in
        </Button>
        <Button
          fullWidth={false}
          variant="contained"
          style={{
            marginLeft: "16px",
            borderRadius: "0",
            backgroundColor: "#637381",
            color: "white",
          }}
          onClick={() => handleUserAuthentication("signUp")}
        >
          Try now
        </Button>
      </>
    </>
  );
};

export const Bar = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static" className={classes.header}>
        <Toolbar className={classes.bar}>
          <NavHeader />
        </Toolbar>
      </AppBar>
    </>
  );
};

export const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const themeProperties = useTheme();

  const isBigScreen = useMediaQuery(themeProperties.breakpoints.up("lg"));

  useEffect(() => {}, [location.pathname]);

  return (
    <>
      <Bar isBigScreen={isBigScreen} />
    </>
  );
};
