import { Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

const colorHeading = "#323232";
const colorHover = "#40c6ff";
const styleOrder = makeStyles({
  orderNo: {
    fontSize: "30px",
    color: `${colorHeading}`,
    fontFamily: "Merriweather",
  },
  stylesstatus: {
    color: `${colorHover}`,
    padding: "0px",
    margin: "0px",
  },
});
const OrderSuccess = (props) => {
  const classes = styleOrder();
  const { response } = props;

  if (!response) {
    return null;
  }

  const responseData = response.checkout;

  window.location.href = responseData.redirect;

  return (
    <Box className="container">
      {"success" === responseData.result ? (
        <div>
          <Typography variant="h3" className={classes.orderNo}>
            Order no: {responseData.order.orderNumber}{" "}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h4">Status : </Typography>
            <Typography variant="h5" className={classes.stylesstatus}>
              {responseData.order.status}
            </Typography>
          </Box>
        </div>
      ) : (
        ""
      )}
    </Box>
  );
};

export default OrderSuccess;
