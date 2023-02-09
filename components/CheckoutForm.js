import { useMutation, useQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuList,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useEffect, useState } from "react";
import Banner from "../assets/img/banner_page.png";
import { createCheckoutData, getFormattedCart } from "../function";
import { AppContext } from "../libs/context/AppContext";
import CHECKOUT_MUTATION from "../libs/mutations/checkout";
import CLEAR_CART_MUTATION from "../libs/mutations/clear-cart";
import GET_CART from "../libs/queries/get-cart";
import {
  handleBillingDifferentThanShipping,
  handleCreateAccount,
  handleStripeCheckout,
  setStatesForCountry
} from "../utils/checkout";
import Address from "./checkout/Address";
import OrderSuccess from "./checkout/OrderSuccess";
import getCountry from "./GetCountry";
import PaymentModes from "./PaymentModes";
import validateAndSanitizeCheckoutForm from "./validator/checkout";

const useStyles = makeStyles({
  checkoutForm: {
    marginTop: "30px",
    display: "flex",
    "@media (max-width: 768px)": {
      display: "block"
    }
  },
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
    "@media (max-width: 768px)": {
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

// const defaultCustomerInfo = {
//   firstName: "DAO",
//   lastName: "QuangThiet",
//   address1: "123 Abc farm",
//   address2: "Hill Road",
//   city: "Mumbai",
//   country: "IN",
//   state: "Maharastra",
//   postcode: "221029",
//   email: "codeytek.academy@gmail.com",
//   phone: "9883778278",
//   company: "The Company",
//   errors: null,
// };
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
  errors: null
};

const CheckoutForm = (props) => {
  const { existingCart } = props;
  const classes = useStyles();
  const initialState = {
    billing: {
      ...defaultCustomerInfo
    },
    shipping: {
      ...defaultCustomerInfo
    },
    createAccount: false,
    orderNotes: "",
    billingDifferentThanShipping: false,
    paymentMethod: "cod"
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
  const [showAlert, setShowAlert] = useState(false);

  // Get Cart Data.
  const { data } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);
      // console.log(updatedCart);
      // if (typeof window !== "undefined") {
      localStorage.setItem("woo-next-cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      // }

      // Update cart data in React Context.
    }
  });

  const [checkout, { data: checkoutResponse, loading: checkoutLoading }] =
    useMutation(CHECKOUT_MUTATION, {
      onCompleted: () => {
        setShowAlert(true);
      },
      variables: {
        input: orderData
      },
      onError: (error) => {
        if (error) {
          setRequestError(error?.graphQLErrors?.[0]?.message ?? "");
        }
      }
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
          errors: shippingValidationResult.errors
        }
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
      shipping: { ...input?.shipping, [target.name]: target.value }
    };
    setInput(newState);
    // await setStatesForCountry(
    //   target,
    //   setTheShippingStates,
    //   setIsFetchingShippingStates
    // );
  };

  const handleBillingChange = async (target) => {
    const newState = {
      ...input,
      billing: { ...input?.billing, [target.name]: target.value }
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
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Box>
      {cart ? (
        <form onSubmit={handleFormSubmit} className={classes.checkoutForm}>
          <Grid container spacing={1}>
            <Grid item lg={8} md={8} xs={12}>
              <Typography variant="h5">Shipping Details</Typography>
              <Address
                states={theShippingStates}
                countries={getCountry}
                input={input?.shipping}
                handleOnChange={(event) => handleOnChange(event, true, true)}
                isFetchingStates={isFetchingShippingStates}
                isShipping
                isBillingOrShipping
              />
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <Box className={classes.payment}>
                <Typography variant="h5">Your Order</Typography>
                {existingCart?.products?.length &&
                  existingCart.products.map((item) => (
                    <MenuItem sx={{ marginBottom: "10px" }} key={item}>
                      <ListItemText>
                        <Typography variant="div">
                          {item.qty} x {item.name}
                        </Typography>
                      </ListItemText>
                      <Typography variant="div">{item.totalPrice}</Typography>
                    </MenuItem>
                  ))}

                <Divider />
                <MenuList>
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
                      {existingCart.totalProductsPrice}
                    </Typography>
                  </MenuItem>
                </MenuList>
                <PaymentModes input={input} handleOnChange={handleOnChange} />
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
                {requestError && (
                  <p>Error : {requestError} : Please try again</p>
                )}
                <Snackbar
                  open={showAlert}
                  autoHideDuration={5000}
                  onClose={handleCloseAlert}
                >
                  <Alert
                    variant="filled"
                    severity="success"
                    onClose={handleCloseAlert}
                    sx={{ width: "100%" }}
                  >
                    Order Successfully!
                  </Alert>
                </Snackbar>
              </Box>
            </Grid>
          </Grid>
        </form>
      ) : null}
      <OrderSuccess response={checkoutResponse} />
    </Box>
  );
};
export default CheckoutForm;
