const express = require("express");
const body_parser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const csvtojson = require("csvtojson");
const path = require("path");
const dayjs = require("dayjs");
const { PORT, JWT_PW } = process.env;
// const mongo = require("../config/mongo");
const app = express();

// mongo.connectToServer();

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

/**
 * Login route
 * @param {String} email - Email of login user
 * @param {String} password - Password of login user
 * @return {String} token
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const db = mongo.getDb();
  // const user = await db.collection("user").findOne({ email, password });

  if (email === "admin@gaivota.ai" && password === "admin") {
    let user = { name: "Admin", email: "admin@gaivota.ai", password: "admin" };
    const token = jwt.sign(user, JWT_PW);
    res.status(200).send({ userData: user, token });
  } else {
    res.statusCode(400);
  }
});

app.get("/auth", (req, res) => {
  let token = req.header("Authorization");
  token = token.split(" ")[1];
  const ok = jwt.verify(token, JWT_PW);
  res.status(200).send(ok);
});

app.get("/", (req, res) => {
  res.status(200).send("Gaivota Test");
});

app.get("/farms", async (req, res) => {
  // let token = req.header("Authorization");
  // token = token.split(" ")[1];
  // const ok = jwt.verify(token, JWT_PW);
  // console.log(ok);
  try {
    const jsonCSV = await csvtojson().fromFile(
      path.join(__dirname + "../../data/farms.csv")
    );
    res.status(200).send(jsonCSV);
    return;
  } catch (error) {
    res.status(404).send(error);
  }
});

const mergeArrayObjects = (a1, a2) =>
  a1.map((itm) => ({
    ...a2.find((item) => item.date === itm.date && item),
    ...itm,
  }));

app.get("/farm/show/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let farmCSV = await csvtojson().fromFile(
      path.join(__dirname + "../../data/farms.csv")
    );

    let nvdi = await csvtojson().fromFile(
      path.join(__dirname + "../../data/farms_ndvi.csv")
    );

    const precipitation = await csvtojson().fromFile(
      path.join(__dirname + "../../data/farms_precipitation.csv")
    );

    let nvdiD = nvdi
      .map((data) => ({
        date: new Date(data.date),
        ndvi: data[`ndvi_${id}`],
      }))
      .reduce((prev, current) => {
        let index = prev.findIndex(
          (e) => e.date === dayjs(current.date).format("MM-YYYY")
        );
        if (index !== -1) {
          prev[index]["nvdi"] =
            prev.find((v) => v.date === dayjs(current.date).format("MM-YYYY"))
              .nvdi + parseFloat(current.ndvi.replace(",", "."));
          return prev;
        } else {
          return [
            ...prev,
            {
              date: dayjs(current.date).format("MM-YYYY"),
              nvdi: parseFloat(current.ndvi.replace(",", ".")),
            },
          ];
        }
      }, []);
    let precipitationD = precipitation
      .map((data) => ({
        date: data.date,
        precipitation: data[`precipitation_${id}`],
      }))
      .reduce((prev, current) => {
        let index = prev.findIndex(
          (e) => e.date === dayjs(current.date).format("MM-YYYY")
        );
        if (index !== -1) {
          prev[index]["precipitation"] =
            prev.find((v) => v.date === dayjs(current.date).format("MM-YYYY"))
              .precipitation +
            parseFloat(current.precipitation.replace(",", "."));
          return prev;
        } else {
          return [
            ...prev,
            {
              date: dayjs(current.date).format("MM-YYYY"),
              precipitation: parseFloat(
                current.precipitation.replace(",", ".")
              ),
            },
          ];
        }
      }, []);

    let farm = {
      ...farmCSV.find((v) => v.farm_id === id),
      data: mergeArrayObjects(precipitationD, nvdiD),
    };
    res.status(200).send(farm);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/ndvi/:id", async (req, res) => {
  let id = req.params.id;
  // let token = req.header("Authorization");
  // token = token.split(" ")[1];
  // const ok = jwt.verify(token, JWT_PW);
  // console.log(ok);
  try {
    let jsonCSV = await csvtojson().fromFile(
      path.join(__dirname + "../../data/farms_ndvi.csv")
    );
    let newJson = jsonCSV.map((data) => {
      return {
        date: data.date,
        ndvi: data[`ndvi_${id}`],
      };
    });
    res.status(200).send(newJson);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/precipitation/:id", async (req, res) => {
  let id = req.params.id;

  // let token = req.header("Authorization");
  // token = token.split(" ")[1];
  // const ok = jwt.verify(token, JWT_PW);
  // console.log(ok);
  try {
    const jsonCSV = await csvtojson().fromFile(
      path.join(__dirname + "../../data/farms_precipitation.csv")
    );
    let newJson = jsonCSV.map((data) => {
      return {
        date: data.date,
        ndvi: data[`precipitation_${id}`],
      };
    });
    res.status(200).send(newJson);
  } catch (error) {
    res.status(404).send(error);
  }
});

// desafio pt 2

app.get("/challenge/encode/:number", (req, res) => {
  let number = req.params.number;
  const buff = Buffer.from(number, "utf-8");
  const base64 = buff.toString("base64");
  res.status(200).send(base64);
});

app.get("/challenge/decode/:code", (req, res) => {
  let code = req.params.code;
  const buff = Buffer.from(code, "base64");
  const str = buff.toString("utf-8");
  res.status(200).send(str);
});

app.listen(PORT !== "undefined" ? PORT : 5000, () => {
  console.warn("App is running at http://localhost:" + PORT);
});

module.exports = app;
