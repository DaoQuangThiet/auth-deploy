import React from "react";
import { isEmpty, map } from "lodash";
import Abbr from "./form-elements/Abbr";
import SvgArrowDown from "../icons/ArrowDown";
import Error from "./Error";
import { Box, TextField, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

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
        {!isEmpty(countries) &&
          map(countries, (country) => (
            <MenuItem
              key={country?.code}
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
