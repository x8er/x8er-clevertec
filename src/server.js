import express from "express";
import path from "path";
import fetch from "node-fetch";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducers";

import Template from "./components/template";
import App from "./components/App";

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const scripts = ["vendor.js", "client.js"];

  let initialState = {};

  await fetch("http://test.clevertec.ru/tt/meta", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      initialState = data;
      initialState.form = {};
      initialState.notify = {
        opened: false,
        complated: false,
      };
    });

  const store = createStore(reducers, initialState);

  const appMarkup = ReactDOMServer.renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const template = ReactDOMServer.renderToStaticMarkup(
    <Template
      children={appMarkup}
      scripts={scripts}
      initialState={initialState}
    />
  );

  res.send(`<!doctype html>${template}`);
});

app.post("/api/sendForm", async (req, res) => {
  await fetch("http://test.clevertec.ru/tt/data", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(req.body),
  })
    .then((response) => response.json())
    .then((data) => res.json(data));
});

app.listen(3000, () => console.log("Listening on localhost:3000"));
