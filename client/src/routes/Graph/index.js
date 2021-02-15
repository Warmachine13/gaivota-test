import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { PropTypes } from "prop-types";
import Button from "../../components/button";
import { useParams } from "react-router-dom";
import { __requestServer } from "../../auth";
import chart_selector from "../../config/chart_selector.json";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import GeoJSON from "geojson";
import {
  // BarChart,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const Search = (props) => {
  const { id } = useParams();
  const { history } = props;
  const [itemData, setItem] = useState({});
  const [selector, setSelector] = useState(0);
  const [geoLocationData, setGeoLocation] = useState({});

  useEffect(() => {
    (async () => {
      let data = await __requestServer({
        method: "GET",
        url: `farm/show/${id}`,
      });

      setItem(data);
      setGeoLocation(GeoJSON.parse(data, { Point: ["latitude", "longitude"] }));
    })();
  }, []);
  return (
    <>
      <Header history={history} title={itemData.name} />
      <div style={{ display: "flex", flex: "row" }}>
        {geoLocationData.geometry ? (
          <div style={{ width: "80%" }}>
            <Map
              style={{ width: "80%", height: 500 }}
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

        <div style={{ width: "40%" }}>
          {itemData.data && (
            <ComposedChart
              // useMesh
              width={500}
              height={300}
              data={itemData.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend textRendering={chart_selector.options[selector].name} />
              {chart_selector.options[selector].chart_type === "bar" ? (
                <Bar
                  dataKey={chart_selector.options[selector].name}
                  fill="#678ccf"
                />
              ) : (
                <Line dataKey="nvdi" fill="#678ccf" />
              )}
              {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
            </ComposedChart>
          )}
          <select
            value={selector}
            style={styles.select}
            onChange={(e) => setSelector(e.target.value)}
          >
            {chart_selector.options.map((v) => {
              return (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              );
            })}
          </select>
          <div style={styles.containerInformation}>
            <div style={styles.containerInformation}>
              <p>Farm: {itemData.name}</p>
              <p>Culture: {itemData.culture}</p>
              <p>Varety: {itemData.variety}</p>
              <p>Area: {itemData.area} ha</p>
              <p>Yield: estimation: {itemData.yield_estimation}</p>
              <p>Total: {itemData.total_area}</p>
              <p>Price: {itemData.price}</p>
              <div style={styles.containerButton}>
                <Button
                  onClick={() =>
                    history.push({ pathname: `/app/payment/${id}` })
                  }
                >
                  Buy now
                </Button>
                <Button
                  onClick={() =>
                    history.push({ pathname: `/app/payment/${id}` })
                  }
                >
                  Bid
                </Button>
              </div>
            </div>
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
  select: {
    margin: "0 10px 0",
    backgroundColor: "#fff",
    width: "95%",
    height: 30,
    border: "1px solid #678ccf",
  },
};

Search.propTypes = {
  history: PropTypes.object,
};

export default Search;
