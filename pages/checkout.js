import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Box, Grid } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import Divider from "@mui/material/Divider";
// import Link from 'next/link';
import { Link } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Input } from "@material-ui/core";
//import { TabsUnstyled , TabsListUnstyled , TabPanelUnstyled , TabUnstyled } from "@mui/base";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import PaymentIcon from "@mui/icons-material/Payment";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Banner from "../assets/img/banner_page.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import CheckoutForm from "../components/CheckoutForm";
import { AppProvider } from "../libs/context/AppContext";
import gql from "graphql-tag";
import client from "../libs/apollo/ApolloClient";
import { ApolloProvider } from "@apollo/client";
import GET_CART from "../libs/queries/get-cart";
import GET_COUNTRIES from "../libs/queries/get-countries";

const useStyles = makeStyles({
  page: {
    marginBottom: "60px",
    minHeight: "200px",
    backgroundImage: `url(${Banner.src})`,
    backgroundSize: "cover",
  },

  titlePage: {
    display: "flex",
    paddingTop: "75px",
    paddingBottom: "75px",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },

  rightTextPage: {
    paddingTop: "12px",
    float: "right",
    "@media (max-width: 768px)": {
      float: "inherit",
    },
  },

  mainCheckout: {
    marginTop: "30px",
    display: "flex",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },
  contactNumber: {
    marginBottom: "35px",
  },
  billingAddress: {
    marginBottom: "35px",
  },
  shippingAddress: {
    marginBottom: "35px",
  },
  delivery: {
    display: "flex",
    padding: "15px",
    "@media (max-width: 350px)": {
      display: "block",
    },
  },
  payment: {
    marginLeft: "20px",
    "@media (max-width: 768px)": {
      marginLeft: "0px",
    },
  },
  tabListPay: {
    marginBottom: "20px",
  },
  tabPay: {
    border: "1px solid #40c6ff",
    width: "120px",
    height: "50px",
    background: "white",
    margin: "10px",
    cursor: "pointer",
  },
  tabPanePay: {
    margin: "10px",
  },
  number: {
    border: "1px",
    background: "#40c6ff",
    borderRadius: "30px",
    marginRight: "15px",
    paddingRight: "7px",
    paddingLeft: "7px",
    paddingTop: "3px",
    paddingBottom: "3px",
  },
  style: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    background: "#fff",
    border: "2px solid #000",
    alignItems: "center",
    justifyContent: "center",
  },
  formInput: {
    width: "100%",

    height: 45,
    "&:focusVisible": {
      outline: ["none"],
    },
  },
  boxinput: {
    width: "100%",
    paddingRight: "10px",
    paddingLeft: "10px",
  },
  textTile: {
    color: "white",
    fontFamily: "Merriweather",
    fontSize: "50px",
    fontWeight: 700,
  },
  titleText: {
    color: "white",
    fontFamily: "Muli",
    fontWeight: 400,
    fontSize: "14px",
  },
});

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Checkout = (props) => {
  const router = useRouter();
  const classes = useStyles();
  let existingCart = "";
  if (typeof localStorage !== "undefined") {
    existingCart = localStorage.getItem("woo-next-cart");
    existingCart = JSON.parse(existingCart);
  }
  // const handleSubmit = (value) => {
  //   router.push(`/thankiu`);
  //   localStorage.removeItem("woo-next-cart");
  // };
  // let existingCart = localStorage ? localStorage.getItem('woo-next-cart'): '';
  // existingCart = JSON.parse(existingCart);
  // console.warn(existingCart);
  return (
    <ApolloProvider client={client}>
      <AppProvider>
        <Box className={classes.page}>
          <Container>
            <Box className={classes.titlePage}>
              <Grid item lg={6}>
                <Box>
                  <Typography
                    className={classes.textTile}
                    component="h3"
                    variant="h3"
                  >
                    Checkout
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={6}>
                <Box className={classes.rightTextPage}>
                  <Breadcrumbs sx={{ color: "white" }} aria-label="breadcrumb">
                    <Typography
                      className={classes.titleText}
                      component="h6"
                      variant="h6"
                    >
                      Home
                    </Typography>
                    <Typography
                      className={classes.titleText}
                      component="h6"
                      variant="h6"
                    >
                      Checkout
                    </Typography>
                  </Breadcrumbs>
                </Box>
              </Grid>
            </Box>
          </Container>
        </Box>
        <Container>
          <Box className={classes.mainCheckout}>
            <CheckoutForm existingCart={existingCart} />
          </Box>
        </Container>
      </AppProvider>
    </ApolloProvider>
  );
};
export default Checkout;
