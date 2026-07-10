import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext.jsx";
import "./index.css";
import {HashRouter } from "react-router-dom";
import {MotionConfig} from 'motion/react'
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
     <GoogleOAuthProvider clientId="1039406391775-cmdagr89lltndgpnqoe0k7174j3vtm13.apps.googleusercontent.com">
      <HashRouter>
       <AppProvider>
        <MotionConfig viewport={{once:true}}>
         <App />
        </MotionConfig>
      </AppProvider>
     </HashRouter>
   </GoogleOAuthProvider>
  </React.StrictMode>
);
