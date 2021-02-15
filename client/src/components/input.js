import React, { InputHTMLAttributes } from "react";
import { PropTypes } from "prop-types";

const Input = (props) => {
  return <input style={{ ...styles.input, ...props.style }} {...props} />;
};

const styles = {
  input: {
    border: "1px solid #678ccf",
    height: 30,
  },
};

Input.propTypes = {
  style: PropTypes.object,
  ...InputHTMLAttributes,
};

export default Input;
