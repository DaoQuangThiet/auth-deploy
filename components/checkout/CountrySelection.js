import { MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField } from "@mui/material";
import { isEmpty, map } from "lodash";
import React from "react";
import Error from "./Error";

const useStyles = makeStyles({});
const CountrySelection = ({ input, handleOnChange, countries, isShipping }) => {
  const { country, errors } = input || {};
  const classes = useStyles();
  const inputId = `country-${isShipping ? "shipping" : "billing"}`;

  return (
    <Box sx={{ padding: "15px" }}>
      <TextField
        fullWidth
        required
        id={inputId}
        select
        name="country"
        value={country}
        label="Country"
        onChange={handleOnChange}
      >
        {countries &&
          countries.map((country, index) => (
            <MenuItem
              key={index}
              data-countrycode={country?.code}
              value={country?.code}
            >
              {country?.name}
            </MenuItem>
          ))}
        {/* </Select> */}
      </TextField>
      {/* </FormControl> */}
      <Error errors={errors} fieldName={"country"} />
    </Box>
  );
};

export default CountrySelection;
