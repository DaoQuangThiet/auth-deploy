import React from "react";
import PropTypes from "prop-types";
import CountrySelection from "./CountrySelection";
import InputField from "./form-elements/InputField";
import StatesSelection from "./StatesSelection";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";

const useStyles = makeStyles({
  contactNumber: {
    marginBottom: "35px",
    display: "flex",
  },
});
const Address = ({
  input,
  countries,
  states,
  handleOnChange,
  isFetchingStates,
  isShipping,
}) => {
  const { errors } = input || {};
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <InputField
            name="firstName"
            inputValue={input?.firstName}
            required
            handleOnChange={handleOnChange}
            label="First name"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="w-full overflow-hidden sm:my-2 sm:px-2 md:w-1/2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="lastName"
            inputValue={input?.lastName}
            required
            handleOnChange={handleOnChange}
            label="Last name"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="w-full overflow-hidden sm:my-2 sm:px-2 md:w-1/2"
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="company"
            inputValue={input?.company}
            handleOnChange={handleOnChange}
            label="Company Name (Optional)"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="mb-4"
          />
        </Grid>

        {/* Country Selection*/}
        <Grid item xs={12}>
          <CountrySelection
            input={input}
            handleOnChange={handleOnChange}
            countries={countries}
            isShipping={isShipping}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="address1"
            inputValue={input?.address1}
            required
            handleOnChange={handleOnChange}
            label="Street address"
            placeholder="House number and street name"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="mb-4"
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="address2"
            inputValue={input?.address2}
            handleOnChange={handleOnChange}
            label="Street address line two"
            placeholder="Apartment floor unit building floor etc(optional)"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="mb-4"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="city"
            required
            inputValue={input?.city}
            handleOnChange={handleOnChange}
            label="Town/City"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="mb-4"
          />
        </Grid>
        {/* State */}
        {/* <StatesSelection
        input={input}
        handleOnChange={handleOnChange}
        states={states}
        isShipping={isShipping}
        isFetchingStates={isFetchingStates}
      /> */}
        <Grid item xs={12} sm={6}>
          <InputField
            name="postcode"
            inputValue={input?.postcode}
            required
            handleOnChange={handleOnChange}
            label="Post code"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="w-full overflow-hidden sm:my-2 sm:px-2 md:w-1/2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="phone"
            inputValue={input?.phone}
            required
            handleOnChange={handleOnChange}
            label="Phone"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="w-full overflow-hidden sm:my-2 sm:px-2 md:w-1/2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="email"
            type="email"
            inputValue={input?.email}
            required
            handleOnChange={handleOnChange}
            label="Email"
            errors={errors}
            isShipping={isShipping}
            containerClassNames="mb-4"
          />
        </Grid>
      </Grid>
    </>
  );
};

Address.propTypes = {
  input: PropTypes.object,
  countries: PropTypes.array,
  handleOnChange: PropTypes.func,
  isFetchingStates: PropTypes.bool,
  isShipping: PropTypes.bool,
};

Address.defaultProps = {
  input: {},
  countries: [],
  handleOnChange: () => null,
  isFetchingStates: false,
  isShipping: false,
};

export default Address;
