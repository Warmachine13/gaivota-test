import React from "react";
// import Button from "./button";
import { PropTypes } from "prop-types";

const Header = (props) => {
  const { history } = props;

  return (
    <header style={styles.header}>
      <div>
        <img style={{ width: 50 }} src={"/logo192.png"} alt="image" />
        <a>{props.title || ""}</a>
      </div>
      <h2 style={{ cursor: "pointer" }} onClick={() => history.push("/login")}>
        LOGIN
      </h2>
    </header>
  );
};

const styles = {
  header: {
    padding: "10px 50px 10px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid #678ccf",

    // width: "100%",
  },
};

Header.propTypes = {
  history: PropTypes.object,
  title: PropTypes.text,
};

export default Header;
