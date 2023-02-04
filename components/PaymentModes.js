import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import Error from "./checkout/Error";
const PaymentModes = ({ input, handleOnChange }) => {
  const { errors, paymentMethod } = input || {};

  return (
    <Box className="mt-3">
      <Error errors={errors} fieldName={"paymentMethod"} />
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          <FormControlLabel
            onChange={handleOnChange}
            value="bacs"
            control={<Radio />}
            name="paymentMethod"
            label="Direct Bank Transfer"
            checked={"bacs" === paymentMethod}
          />
          <FormControlLabel
            onChange={handleOnChange}
            value="paypal"
            name="paymentMethod"
            control={<Radio />}
            label="Pay with Paypal"
            checked={"paypal" === paymentMethod}
          />
          <FormControlLabel
            onChange={handleOnChange}
            value="cod"
            control={<Radio />}
            name="paymentMethod"
            label="Cash on Delivery"
            checked={"cod" === paymentMethod}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentModes;
