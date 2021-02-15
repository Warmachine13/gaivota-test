import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { PropTypes } from "prop-types";
import Input from "../../components/input";
import Button from "../../components/button";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import GeoJSON from "geojson";
import { __requestServer } from "../../auth";

const Home = (props) => {
  console.log(props);
  const { history } = props;
  const [farms, setFarms] = useState([]);
  const [itemData, setItem] = useState({});
  const [geoLocationData, setGeoLocation] = useState({});

  useEffect(() => {
    (async () => {
      let data = await __requestServer({ method: "GET", url: "farms" });
      setFarms(data);
      setItem(data[0]);
      console.log(data);
      setGeoLocation(
        GeoJSON.parse(data[0], { Point: ["latitude", "longitude"] })
      );
    })();
  }, []);

  const setLocation = (e) => {
    setItem(farms.find((v) => v.farm_id === e.target.value));
    setGeoLocation(
      GeoJSON.parse(
        farms.find((v) => v.farm_id === e.target.value),
        { Point: ["latitude", "longitude"] }
      )
    );
  };
  return (
    <>
      <Header history={history} />
      <div style={{ display: "flex", flex: "row" }}>
        {geoLocationData.geometry ? (
          <div style={{ width: "80%" }}>
            <Map
              style={{ width: 1000, height: 500 }}
              center={geoLocationData.geometry.coordinates}
              zoom={13}
            >
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={geoLocationData.geometry.coordinates}>
                <Popup>
                  <span>{itemData.name}</span>
                </Popup>
              </Marker>
            </Map>
          </div>
        ) : (
          <></>
        )}

        <div style={{ width: "30%" }}>
          <h1 style={{ textDecoration: "undeline" }}>{itemData.name}</h1>
          <Input style={{ width: "90%" }} placeholder="SEARCH BAR" />
          <div style={styles.containerInformation}>
            <div
              onClick={() => history.push(`/app/graph/${itemData.farm_id}`)}
              style={styles.containerInformation}
            >
              <p>Farm: {itemData.name}</p>
              <p>Culture: {itemData.culture}</p>
              <p>Varety: {itemData.variety}</p>
              <p>Area: {itemData.area} ha</p>
              <p>Yield: estimation: {itemData.yield_estimation}</p>
              <p>Total: {itemData.total_area}</p>
              <p>Price: {itemData.price}</p>
              <div style={styles.containerButton}>
                <Button>Buy now</Button>
                <Button>Bid</Button>
              </div>
            </div>
            <select
              value={itemData.id}
              style={{
                margin: "0 10px 0",
                backgroundColor: "#fff",
                width: "95%",
                height: 30,
                border: "1px solid #678ccf",
              }}
              onChange={(e) => setLocation(e)}
            >
              {farms.map((v) => {
                return (
                  <option key={v.farm_id} value={v.farm_id}>
                    Farm: {v.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  containerInformation: {
    border: "1px solid #678ccf",
    margin: "20px 10px 20px",
    padding: 10,
  },
  containerButton: {
    width: "30%",
    flexDirection: "row",
    display: "flex",
    margin: "10px 0 15px",
    justifyContent: "space-between",
  },
};

Home.propTypes = {
  history: PropTypes.object,
};

export default Home;
