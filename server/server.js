const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CLIENT_ID = "79982134b31c82508910";
const CLIENT_SECRET = "01900109bab48bf527d83ad61b7abc8e7dfad8f5";

app.get("/getAccessToken", async function (req, res) {
  const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

app.get("/getUserData", async (req, res) => {
  req.get("Authorization");
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

app.get("/getIssueData", async (req, res) => {
  req.get("Authorization");
  await fetch("https://api.github.com/repos/Ping-Hsuan-Yu/Testing/issues", {
    method: "GET",
    owner: "Ping-Hsuan-Yu",
    repo: "Testing",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

app.listen(4000, () => {
  console.log("4000? good?");
});
