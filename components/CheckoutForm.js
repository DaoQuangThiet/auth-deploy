import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  Link,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/Add";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Banner from "../assets/img/banner_page.png";
import { AppContext } from "../libs/context/AppContext";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import client from "../libs/apollo/ApolloClient";
import { reach } from "yup";
import { createCheckoutData, getFormattedCart } from "../function";
import GET_CART from "../libs/queries/get-cart";
import CHECKOUT_MUTATION from "../libs/mutations/checkout";
import CLEAR_CART_MUTATION from "../libs/mutations/clear-cart";
import Address from "./checkout/Address";
import Divider from "@mui/material/Divider";
import {
  TabPanelUnstyled,
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
} from "@mui/base";
import { Input } from "@material-ui/core";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  handleBillingDifferentThanShipping,
  handleCreateAccount,
  handleStripeCheckout,
  setStatesForCountry,
} from "../utils/checkout";
import CheckboxField from "./checkout/form-elements/CheckboxField";

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
  const { existingCart } = props;
  const { billingCountries, shippingCountries } = {};
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
  const { data } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);
      console.log(updatedCart);
      // if (typeof window !== "undefined") {
      //   localStorage.setItem("woo-next-cart", JSON.stringify(updatedCart));
      //   setCart(updatedCart);
      // }

      // Update cart data in React Context.
    },
  });

  const [checkout, { data: checkoutResponse, loading: checkoutLoading }] =
    useMutation(CHECKOUT_MUTATION, {
      variables: {
        input: orderData,
      },
      onError: (error) => {
        if (error) {
          setRequestError(error?.graphQLErrors?.[0]?.message ?? "");
        }
      },
    });
  const [clearCartMutation] = useMutation(CLEAR_CART_MUTATION);
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    /**
     * Validate Billing and Shipping Details
     *
     * Note:
     * 1. If billing is different than shipping address, only then validate billing.
     * 2. We are passing theBillingStates?.length and theShippingStates?.length, so that
     * the respective states should only be mandatory, if a country has states.
     */
    const billingValidationResult = input?.billingDifferentThanShipping
      ? validateAndSanitizeCheckoutForm(
          input?.billing,
          theBillingStates?.length
        )
      : { errors: null, isValid: true };
    const shippingValidationResult = validateAndSanitizeCheckoutForm(
      input?.shipping,
      theShippingStates?.length
    );

    if (!shippingValidationResult.isValid || !billingValidationResult.isValid) {
      setInput({
        ...input,
        billing: { ...input.billing, errors: billingValidationResult.errors },
        shipping: {
          ...input.shipping,
          errors: shippingValidationResult.errors,
        },
      });

      return;
    }

    if ("stripe-mode" === input.paymentMethod) {
      const createdOrderData = await handleStripeCheckout(
        input,
        cart?.products,
        setRequestError,
        clearCartMutation,
        setIsStripeOrderProcessing,
        setCreatedOrderData
      );
      return null;
    }

    const checkOutData = createCheckoutData(input);
    setRequestError(null);
    /**
     *  When order data is set, checkout mutation will automatically be called,
     *  because 'orderData' is added in useEffect as a dependency.
     */
    setOrderData(checkOutData);
  };
  const handleOnChange = async (
    event,
    isShipping = false,
    isBillingOrShipping = false
  ) => {
    const { target } = event || {};

    if ("createAccount" === target.name) {
      handleCreateAccount(input, setInput, target);
    } else if ("billingDifferentThanShipping" === target.name) {
      handleBillingDifferentThanShipping(input, setInput, target);
    } else if (isBillingOrShipping) {
      if (isShipping) {
        await handleShippingChange(target);
      } else {
        await handleBillingChange(target);
      }
    } else {
      const newState = { ...input, [target.name]: target.value };
      setInput(newState);
    }
  };

  const handleShippingChange = async (target) => {
    const newState = {
      ...input,
      shipping: { ...input?.shipping, [target.name]: target.value },
    };
    setInput(newState);
    await setStatesForCountry(
      target,
      setTheShippingStates,
      setIsFetchingShippingStates
    );
  };

  const handleBillingChange = async (target) => {
    const newState = {
      ...input,
      billing: { ...input?.billing, [target.name]: target.value },
    };
    setInput(newState);
    await setStatesForCountry(
      target,
      setTheBillingStates,
      setIsFetchingBillingStates
    );
  };
  useEffect(() => {
    async function FetchData() {
      if (null !== orderData) {
        // Call the checkout mutation when the value for orderData changes/updates.
        await checkout();
      }
    }
    FetchData();
  }, [orderData]);
  const isOrderProcessing = checkoutLoading || isStripeOrderProcessing;

  return (
    <>
      {cart ? (
        <FormControl
          onSubmit={handleFormSubmit}
          className={classes.checkoutForm}
          xs={{ display: "flex" }}
        >
          <Grid iteam lg={8}>
            <Typography variant="h3">Checkout Page</Typography>
            <Box className="billing-details-container">
              <Typography variant="h4">Shipping Details</Typography>
              <Address
                states={theShippingStates}
                countries={shippingCountries}
                input={input?.shipping}
                handleOnChange={(event) => handleOnChange(event, true, true)}
                isFetchingStates={isFetchingShippingStates}
                isShipping
                isBillingOrShipping
              />
            </Box>
            <Box>
              <CheckboxField
                name="billingDifferentThanShipping"
                type="checkbox"
                checked={input?.billingDifferentThanShipping}
                handleOnChange={handleOnChange}
                label="Billing different than shipping"
                containerClassNames="mb-4 pt-4"
              />
            </Box>
            {input?.billingDifferentThanShipping ? (
              <Box className="billing-details-container">
                <Typography variant="h4">Billing Details</Typography>
                <Address
                  states={theBillingStates}
                  countries={billingCountries}
                  input={input?.billing}
                  handleOnChange={(event) => handleOnChange(event, false, true)}
                  isFetchingStates={isFetchingBillingStates}
                  isShipping={false}
                  isBillingOrShipping
                />
              </Box>
            ) : null}

            {/* <Paper className={classes.contactNumber}>
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
            </Paper> */}
            {/* <Paper className={classes.billingAddress}>
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
            </Paper> */}
            {/* <Paper className={classes.shippingAddress}>
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
            </Paper> */}
            {/* <Paper className={classes.deliverySchedule}>
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
            </Paper> */}
          </Grid>
          <Grid iteam lg={4}>
            <Box className={classes.payment}>
              <Typography variant="h4">Your Order</Typography>
              {existingCart?.products?.length &&
                existingCart.products.map((item) => (
                  <MenuItem sx={{ marginBottom: "10px" }} key={item}>
                    <ListItemText>
                      <Typography variant="div">
                        {item.qty} x {item.name}
                      </Typography>
                    </ListItemText>
                    <Typography variant="div">${item.totalPrice}</Typography>
                  </MenuItem>
                ))}

              <Divider />
              <MenuList>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography variant="div">Sub Total</Typography>
                  </ListItemText>
                  <Typography variant="div">
                    ${existingCart.totalProductsPrice}
                  </Typography>
                </MenuItem>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography variant="div">Tax</Typography>
                  </ListItemText>
                  <Typography variant="div">$0.00</Typography>
                </MenuItem>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography variant="div">Shipping</Typography>
                  </ListItemText>
                  <Typography variant="div">$0.00</Typography>
                </MenuItem>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography>
                      <Link>Do you have Coupon?</Link>
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </MenuList>

              <Divider />
              <Divider />

              <MenuList>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography sx={{ fontWeight: "600" }}>
                      Sub Total
                    </Typography>
                  </ListItemText>
                  <Typography sx={{ fontWeight: "600" }}>
                    ${existingCart.totalProductsPrice}
                  </Typography>
                </MenuItem>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography variant="div">Wallet points</Typography>
                  </ListItemText>
                  <Typography variant="div">0</Typography>
                </MenuItem>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography variant="div">Wallet currency</Typography>
                  </ListItemText>
                  <Typography variant="div">$0.00</Typography>
                </MenuItem>
                <MenuItem sx={{ marginBottom: "10px" }}>
                  <ListItemText>
                    <Typography>
                      <Checkbox color="default" />
                      <Link>Do you have Coupon?</Link>
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </MenuList>
              <Paper sx={{ marginTop: "15px" }}>
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: "15px",
                  }}
                >
                  <Typography sx={{ fontWeight: "600" }}>
                    Choose Payment Method
                  </Typography>
                  <Box>
                    <TabsUnstyled defaultValue={0}>
                      <TabsListUnstyled className={classes.tabListPay}>
                        <TabUnstyled className={classes.tabPay}>
                          Stripe
                        </TabUnstyled>
                        <TabUnstyled className={classes.tabPay}>
                          Cash On Delivery
                        </TabUnstyled>
                      </TabsListUnstyled>
                      <TabPanelUnstyled
                        className={classes.tabPanePay}
                        value={0}
                      >
                        <FormControl variant="standard">
                          <Input
                            id="input-with-icon-adornment"
                            startAdornment={
                              <InputAdornment position="start">
                                <PaymentIcon />
                                số thẻ
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </TabPanelUnstyled>
                      <TabPanelUnstyled
                        className={classes.tabPanePay}
                        value={1}
                      >
                        <FormControl variant="standard">
                          <Input
                            id="input-with-icon-adornment"
                            startAdornment={
                              <InputAdornment position="start">
                                <PaymentIcon />
                                số thẻ
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </TabPanelUnstyled>
                    </TabsUnstyled>
                    <Box
                      sx={{
                        textAlign: "center",
                        paddingBottom: "15px",
                        paddingTop: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#40c6ff" }}
                      >
                        Success
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Button
                  disabled={isOrderProcessing}
                  type="submit"
                  // onClick={handleSubmit}
                  sx={{ width: "100%", backgroundColor: "#40c6ff" }}
                  variant="contained"
                >
                  Place Order
                </Button>
              </Stack>
              {isOrderProcessing && <p>Processing Order...</p>}
              {requestError && <p>Error : {requestError} : Please try again</p>}
            </Box>
          </Grid>
        </FormControl>
      ) : null}
    </>
  );
};
export default CheckoutForm;
