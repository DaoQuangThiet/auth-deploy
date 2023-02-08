import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getUpdatedItems, updateCart } from "../../../function";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import { v4 } from "uuid";

const useStyles_cartItem = makeStyles((theme) => ({
  cartelementPrice: {
    color: "rgb(64,198,255)"
  },
  cartelementTotal: {
    color: "rgb(64,198,255)"
  },
  cartqtyinput: {
    width: "50%",
    height: "40px",
    paddingLeft: "10px"
  }
}));

const CartItem = ({
  item,
  products,
  updateCartProcessing,
  handleRemoveProductClick,
  updateCart
}) => {
  const [productCount, setProductCount] = useState(item.qty);

  const handleQtyChange = (event, cartKey) => {
    if (process.browser) {
      event.stopPropagation();

      // If the previous update cart mutation request is still processing, then return.
      if (updateCartProcessing) {
        return;
      }

      // If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
      const newQty = event.target.value ? event.target.value : 1;

      // Set the new qty in state.
      setProductCount(newQty);

      if (products.length) {
        const updatedItems = getUpdatedItems(products, newQty, cartKey);

        updateCart({
          variables: {
            input: {
              clientMutationId: v4(),
              items: updatedItems
            }
          }
        });
      }
    }
  };

  const classes = useStyles_cartItem();
  return (
    <TableRow className={classes.cartitem} key={item.productId}>
      {/*Icon close */}
      <TableCell className={classes.cartelement}>
        <Typography
          sx={{ cursor: "pointer" }}
          className={classes.cartcloseicon}
          onClick={(event) =>
            handleRemoveProductClick(event, item.cartKey, products)
          }
        >
          <CloseIcon />
        </Typography>
      </TableCell>
      {/* image */}
      <TableCell className={classes.cartelementImg}>
        <Image
          width={150}
          height={150}
          src={item.image.sourceUrl}
          alt={item.image.title}
        />
      </TableCell>
      {/* image */}
      <TableCell className={classes.cartelementName}>{item?.name}</TableCell>
      {/* PRICE */}
      <TableCell className={classes.cartelementPrice}>
        ${"string" !== typeof item.price ? item.price.toFixed(2) : item.price}
      </TableCell>
      {/* QUANTITY */}
      <TableCell className={classes.cartelementInput}>
        <input
          className={classes.cartqtyinput}
          size="small"
          type="number"
          min="1"
          data-cart-key={item.cartKey}
          value={productCount}
          onChange={(event) => handleQtyChange(event, item.cartKey)}
        />
      </TableCell>
      {/* Total */}
      <TableCell className={classes.cartelementTotal}>
        {"string" !== typeof item.totalPrice
          ? item.totalPrice.toFixed(2)
          : item.totalPrice}
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
