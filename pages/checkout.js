import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";

// import Link from 'next/link';
//import { TabsUnstyled , TabsListUnstyled , TabPanelUnstyled , TabUnstyled } from "@mui/base";
import { ApolloProvider } from "@apollo/client";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import Banner from "../assets/img/banner_page.png";
import CheckoutForm from "../components/CheckoutForm";
import client from "../libs/apollo/ApolloClient";

const useStyles = makeStyles({
  page: {
    marginBottom: "60px",
    minHeight: "200px",
    backgroundImage: `url(${Banner.src})`,
    backgroundSize: "cover"
  },

  titlePage: {
    display: "flex",
    paddingTop: "75px",
    paddingBottom: "75px",
    "@media (max-width: 768px)": {
      display: "block"
    }
  },

  rightTextPage: {
    paddingTop: "12px",
    float: "right",
    "@media (max-width: 768px)": {
      float: "inherit"
    }
  },

  mainCheckout: {
    marginTop: "30px",
    display: "flex",
    "@media (max-width: 600px)": {
      display: "block"
    }
  },
  contactNumber: {
    marginBottom: "35px"
  },
  billingAddress: {
    marginBottom: "35px"
  },
  shippingAddress: {
    marginBottom: "35px"
  },
  delivery: {
    display: "flex",
    padding: "15px",
    "@media (max-width: 350px)": {
      display: "block"
    }
  },
  payment: {
    marginLeft: "20px",
    "@media (max-width: 768px)": {
      marginLeft: "0px"
    }
  },
  tabListPay: {
    marginBottom: "20px"
  },
  tabPay: {
    border: "1px solid #40c6ff",
    width: "120px",
    height: "50px",
    background: "white",
    margin: "10px",
    cursor: "pointer"
  },
  tabPanePay: {
    margin: "10px"
  },
  number: {
    border: "1px",
    background: "#40c6ff",
    borderRadius: "30px",
    marginRight: "15px",
    paddingRight: "7px",
    paddingLeft: "7px",
    paddingTop: "3px",
    paddingBottom: "3px"
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
    justifyContent: "center"
  },
  formInput: {
    width: "100%",

    height: 45,
    "&:focusVisible": {
      outline: ["none"]
    }
  },
  boxinput: {
    width: "100%",
    paddingRight: "10px",
    paddingLeft: "10px"
  },
  textTile: {
    color: "white",
    fontFamily: "Merriweather",
    fontSize: "50px",
    fontWeight: 700
  },
  titleText: {
    color: "white",
    fontFamily: "Muli",
    fontWeight: 400,
    fontSize: "14px"
  }
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
      <Box className={classes.page}>
        <Container>
          <Box className={classes.titlePage}>
            <Grid container spacing={1}>
              <Grid item lg={6} md={6} xs={12}>
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
              <Grid item lg={6} md={6} xs={12}>
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
            </Grid>
          </Box>
        </Container>
      </Box>
      <Container>
        <Box className={classes.mainCheckout}>
          <CheckoutForm existingCart={existingCart} />
        </Box>
      </Container>
    </ApolloProvider>
  );
};
export default Checkout;
