import { Box } from "@mui/material";

const OrderSuccess = (props) => {
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
          <h2>Order no: {responseData.order.orderNumber} </h2>
          <p>Status : {responseData.order.status}</p>
        </div>
      ) : (
        ""
      )}
    </Box>
  );
};

export default OrderSuccess;
