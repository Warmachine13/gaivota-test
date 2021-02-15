import React, { useState } from "react";
import Input from "../../components/input";
import { withRouter } from "react-router-dom";
import { authenticate } from "../../auth";
import { PropTypes } from "prop-types";
import Button from "../../components/button";

const Login = (props) => {
  const { history } = props;
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  /**
   * Handle the input change and changes the form state
   * @function handleChange
   * @param {String} key - Form field key
   * @returns {Function} On change event handler
   */
  const handleChange = (key) => ({ target }) => {
    setLoginForm({ ...loginForm, [key]: target.value });
  };

  /**
   * Submit the login form and handles the response
   * @function handleSubmit
   * @param {Event} e - Submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { email, password } = loginForm;
    try {
      // Here you can store the userData in any way
      console.log("entrou", email);
      const userData = await authenticate(email, password);
      console.log(userData);
      history.push("/app/home");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form style={{ height: "100%" }} onSubmit={handleSubmit}>
      <div style={styles.container}>
        <Input
          name="email"
          type="input"
          // style={{ padding: "10px" }}
          onChange={handleChange("email")}
          value={loginForm.email}
          placeholder="admin@gaivota.ai"
        />
        <Input
          name="password"
          type="password"
          onChange={handleChange("password")}
          value={loginForm.password}
          autoComplete="off"
        />
        <Button type="submit">LOGIN</Button>
      </div>
    </form>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "200px",
    padding: "20%",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around",
  },
};

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
