import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Input from "../../components/input";
import Button from "../../components/button";
import { PropTypes } from "prop-types";
import { __requestServer } from "../../auth";
import { useParams } from "react-router-dom";

const Payment = (props) => {
  const { history } = props;
  const { id } = useParams();
  const [itemData, setItem] = useState({});
  const [totalyield, setYields] = useState(1);
  useEffect(() => {
    (async () => {
      let data = await __requestServer({
        method: "GET",
        url: `farm/show/${id}`,
      });

      setItem(data);
    })();
  }, []);
  return (
    <>
      <Header history={history} title={itemData.name} />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            padding: 60,
            borderRight: "1px solid blue",
          }}
        >
          <div style={{ width: "100%", borderBottom: "1px solid blue" }}>
            <h2>Offer bid</h2>
            <form>
              <div style={{ flexDirection: "row", margin: "0 0 10px 0" }}>
                <a>Price:</a> <Input name="price" value={itemData.price} />{" "}
                <a>$/sac</a>
              </div>
              <div style={{ flexDirection: "row" }}>
                <a>Yield:</a>{" "}
                <Input
                  value={totalyield}
                  oninput="validity.valid||(value='');"
                  min="1"
                  step="1"
                  // onBlur={}
                  onChange={(e) => setYields(e.target.value)}
                  name="yield"
                  type="number"
                />{" "}
                <a>sac</a>
              </div>
              <p>TOTAL: {itemData.price * totalyield} $</p>
            </form>
          </div>
          <div>
            <h2>Pay with:</h2>
            <Button style={{ width: 200, margin: "0 0 10px 0" }}>Paypal</Button>
            <br />
            <Button style={{ width: 200 }}>Credit Card</Button>
          </div>
        </div>
        <div style={{ width: "50%", height: "100%", padding: 60 }}>
          <h1>Login Paypal:</h1>
          <form>
            <div style={{ flexDirection: "row", margin: "0 0 10px 0" }}>
              <Input name="login" /> <a>user</a>
            </div>
            <div style={{ flexDirection: "row", margin: "0 0 10px 0" }}>
              <Input name="passwod" /> <a>password</a>
            </div>
            <h3>Card Number</h3>
            <Input name="card" />

            <h3>Name</h3>
            <Input name="name" />
            <br />
            <Button type="submit" style={{ margin: 20, right: 0 }}>
              PAY
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

Payment.propTypes = {
  history: PropTypes.object,
};

export default Payment;
