import Link from "next/link";
import React from "react";
import { useState, useContext } from "react";
import { AppContext } from "../../libs/context/AppContext";
import { addFirstProduct, getFormattedCart, updateCart } from "../../function";

import { makeStyles } from "@material-ui/core/styles";
import { AppProvider } from "../../libs/context/AppContext";
import { v4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import GET_CART from "../../libs/queries/get-cart";
import ADD_TO_CART from "../../libs/mutations/add-to-cart";
import { Alert, Snackbar } from "@mui/material";

const colorHover = "#40c6ff";

const useStyles = makeStyles({
  btnviewcart: {
    margin: "25px"
  },
  AddToCartButton: {
    borderRadius: "20px",
    backgroundColor: `${colorHover}`,
    height: "40px",
    lineHeight: "34px",
    padding: "0px 30px",
    color: "#fff",
    border: "none",
    textTransform: "uppercase",
    fontSize: "16px",
    marginTop: "20px",
    "&:hover": {
      cursor: "pointer"
    },
    "&:last-child": {
      marginLeft: "20px"
    }
  }
});

const AddToCartButton = (props) => {
  const classes = useStyles();
  const { product } = props;
  const [cart, setCart] = useContext(AppContext);
  const [showViewCart, setShowViewCart] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleClose = () => {
    setShowAlert(false);
  };
  const productQryInput = {
    clientMutationId: v4(),
    productId: product.productId
  };

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);
      localStorage.setItem("woo-next-cart", JSON.stringify(updatedCart));

      setCart(updatedCart);
    }
  });
  const [
    addToCart,
    { data: addToCartRes, loading: addToCartLoading, error: addToCartError }
  ] = useMutation(ADD_TO_CART, {
    variables: {
      input: productQryInput
    },
    onCompleted: () => {
      refetch();
      setShowViewCart(true);
    },
    onError: (error) => {
      if (error) {
        setRequestError(error.graphQLErrors?.[0]?.message ?? "");
      }
    }
  });

  const handleAddToCartClick = async () => {
    setRequestError(null);
    await addToCart();
    setShowAlert(true);
    // if (process.browser) {
    //   let existingCart = localStorage.getItem("woo-next-cart");

    //   // if cart has item(s) already, then update the exiting

    //   if (existingCart) {
    //     existingCart = JSON.parse(existingCart);

    //     const qtyToBeAdded = 1;

    //     const updatedCart = updateCart(existingCart, product, qtyToBeAdded);
    //     setCart(updatedCart);
    //   } else {
    //     // add new cart
    //     const newCart = addFirstProduct(product);
    //     setCart(newCart);
    //   }
    //   setShowViewCart(true);
    // }
  };

  return (
    <AppProvider>
      <React.Fragment>
        <button
          className={classes.AddToCartButton}
          onClick={handleAddToCartClick}
        >
          {addToCartLoading ? "Adding To Cart..." : "Add To Cart"}
        </button>
        <Snackbar
          open={showAlert}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            variant="filled"
            severity="success"
            onClose={handleClose}
            sx={{ width: "100%" }}
          >
            Add to cart successfully!
          </Alert>
        </Snackbar>
        {showViewCart && (
          <Link href="/cart">
            <a>
              <button className={classes.AddToCartButton}>View Cart</button>
            </a>
          </Link>
        )}
      </React.Fragment>
    </AppProvider>
  );
};

export default AddToCartButton;
