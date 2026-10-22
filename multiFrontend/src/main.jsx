import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./redux/store";
import { resetSession } from "./redux/actions";
import { setUnauthorizedHandler } from "./api/axios";
import "./index.css";

// An expired session anywhere in the app signs the user out; routes then redirect to /login.
setUnauthorizedHandler(() => store.dispatch(resetSession()));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
