import React from "react";
import { PropTypes } from "prop-types";

const Button = ({ style, ...props }) => {
  return <button style={{ ...styles.button, ...style }} {...props} />;
};

const styles = {
  button: {
    border: "1px solid #678ccf",
    backgroundColor: "#fff",
    height: 35,
  },
};

Button.propTypes = {
  style: PropTypes.object,
};

export default Button;
