import { Box, Grid, MenuList, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/Add";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useContext, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Banner from "../assets/img/banner_page.png";
import { AppContext } from "../libs/context/AppContext";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import client from "../libs/apollo/ApolloClient";
import { reach } from "yup";
import { getFormattedCart } from "../function";
import GET_CART from "../libs/queries/get-cart";

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
const defaultCustomerInfo = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  country: "",
  state: "",
  postcode: "",
  email: "",
  phone: "",
  company: "",
  errors: null,
};

const CheckoutForm = (props) => {
  const classes = useStyles();
  const initialState = {
    billing: {
      ...defaultCustomerInfo,
    },
    shipping: {
      ...defaultCustomerInfo,
    },
    createAccount: false,
    orderNotes: "",
    billingDifferentThanShipping: false,
    paymentMethod: "cod",
  };

  const [cart, setCart] = useContext(AppContext);
  const [input, setInput] = useState(initialState);
  const [orderData, setOrderData] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [theShippingStates, setTheShippingStates] = useState([]);
  const [isFetchingShippingStates, setIsFetchingShippingStates] =
    useState(false);
  const [theBillingStates, setTheBillingStates] = useState([]);
  const [isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
  const [isStripeOrderProcessing, setIsStripeOrderProcessing] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState({});

  // Get Cart Data.
  const data = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("woo-next-cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
      }

      // Update cart data in React Context.
    },
  });

  return (
    <>
      <Grid iteam lg={8}>
        <Typography variant="h3">Checkout Page</Typography>
        <Paper className={classes.contactNumber}>
          <MenuList>
            <MenuItem sx={{ marginBottom: "10px" }}>
              <ListItemText>
                <Typography
                  variant="div"
                  color="#fff"
                  className={classes.number}
                >
                  1
                </Typography>
                Contact Number
              </ListItemText>
              <ListItemIcon sx={{ color: "#40c6ff" }}>
                <AddIcon label="add" fontSize="small" />
                Update
              </ListItemIcon>
            </MenuItem>
          </MenuList>
          <Box sx={{ display: "flex", padding: "15px" }}>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.billingAddress}>
          <MenuList>
            <MenuItem sx={{ marginBottom: "10px" }}>
              <ListItemText>
                <Typography
                  variant="div"
                  color="#fff"
                  className={classes.number}
                >
                  2
                </Typography>
                Billing Address
              </ListItemText>
              <ListItemIcon sx={{ color: "#40c6ff" }}>
                <AddIcon label="add" fontSize="small" />
                Update
              </ListItemIcon>
            </MenuItem>
          </MenuList>
          <Box sx={{ display: "flex", padding: "15px" }}>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.shippingAddress}>
          <MenuList>
            <MenuItem sx={{ marginBottom: "10px" }}>
              <ListItemText>
                <Typography
                  variant="div"
                  color="#fff"
                  className={classes.number}
                >
                  3
                </Typography>
                Shipping Address
              </ListItemText>
              <ListItemIcon sx={{ color: "#40c6ff" }}>
                <AddIcon label="add" fontSize="small" />
                Update
              </ListItemIcon>
            </MenuItem>
          </MenuList>
          <Box sx={{ display: "flex", padding: "15px" }}>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.deliverySchedule}>
          <MenuList>
            <MenuItem sx={{ marginBottom: "10px" }}>
              <ListItemText>
                <Typography
                  variant="div"
                  color="#fff"
                  className={classes.number}
                >
                  4
                </Typography>
                Delivery Schedule
              </ListItemText>
            </MenuItem>
          </MenuList>
          <Box sx={{ display: "flex", padding: "15px" }}>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
            <Box className={classes.boxinput}>
              <input className={classes.formInput} type="text" />
            </Box>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
export default CheckoutForm;
