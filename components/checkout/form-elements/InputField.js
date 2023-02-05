import Error from "../Error";
import PropTypes from "prop-types";
import Abbr from "./Abbr";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Box, MenuList, TextField, Typography } from "@mui/material";

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
  errors: null,
};
const useStyles = makeStyles({
  boxinput: {
    width: "100%",
    paddingRight: "10px",
    paddingLeft: "10px",
  },
  formInput: {
    width: "100%",
    height: 45,
    "&:focusVisible": {
      outline: ["none"],
    },
  },
});
const InputField = ({
  handleOnChange,
  inputValue,
  name,
  type,
  label,
  errors,
  placeholder,
  required,
  containerClassNames,
  isShipping,
}) => {
  const inputId = `${name}-${isShipping ? "shipping" : ""}`;
  const classes = useStyles();

  return (
    <Box sx={{ padding: "15px" }} className={classes.containerClassNames}>
      <TextField
        fullWidth
        required={required}
        id={inputId}
        label={label}
        onChange={handleOnChange}
        value={inputValue}
        type="type"
        name={name}
      />
      <Error errors={errors} fieldName={name} />
      {/* <input
            onChange={handleOnChange}
            value={inputValue}
            placeholder={placeholder}
            type={type}
            name={name}
            className={classes.formInput}
            id={inputId}
          /> */}
    </Box>
  );
};

InputField.propTypes = {
  handleOnChange: PropTypes.func,
  inputValue: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  errors: PropTypes.object,
  required: PropTypes.bool,
  containerClassNames: PropTypes.string,
};

InputField.defaultProps = {
  handleOnChange: () => null,
  inputValue: "",
  name: "",
  type: "text",
  label: "",
  placeholder: "",
  errors: {},
  required: false,
  containerClassNames: "",
};

export default InputField;
