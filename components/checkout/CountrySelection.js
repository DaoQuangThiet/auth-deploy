import React from "react";
import { isEmpty, map } from "lodash";
import Abbr from "./form-elements/Abbr";
import SvgArrowDown from "../icons/ArrowDown";
import Error from "./Error";
import { Box, Typography } from "@mui/material";

const CountrySelection = ({ input, handleOnChange, countries, isShipping }) => {
  const { country, errors } = input || {};

  const inputId = `country-${isShipping ? "shipping" : "billing"}`;

  return (
    <Box sx={{ display: "block", padding: "15px" }} className="mb-3">
      <Typography className="leading-7 text-sm text-gray-700" htmlFor={inputId}>
        Country
        <Abbr required />
      </Typography>
      <div className="relative w-full border-none">
        <select
          onChange={handleOnChange}
          value={country}
          name="country"
          className="bg-gray-100 bg-opacity-50 border border-gray-500 text-gray-500 appearance-none inline-block py-3 pl-3 pr-8 rounded leading-tight w-full"
          id={inputId}
        >
          <option value="">Select a country...</option>
          {!isEmpty(countries) &&
            map(countries, (country) => (
              <option
                key={country?.code}
                data-countrycode={country?.code}
                value={country?.code}
              >
                {country?.name}
              </option>
            ))}
        </select>
        <span
          className="absolute right-0 mr-1 text-gray-500"
          style={{ top: "25%" }}
        >
          <SvgArrowDown width={24} height={24} className="fill-current" />
        </span>
      </div>
      <Error errors={errors} fieldName={"country"} />
    </Box>
  );
};

export default CountrySelection;
