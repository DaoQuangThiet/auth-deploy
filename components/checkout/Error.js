import { Box } from "@mui/material";

const Error = ({ errors, fieldName }) => {
  return errors && errors.hasOwnProperty(fieldName) ? (
    <Box sx={{ color: "#f56565" }}>{errors[fieldName]}</Box>
  ) : (
    ""
  );
};

export default Error;
