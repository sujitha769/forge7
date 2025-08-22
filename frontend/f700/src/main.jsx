// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";

// import Landingpage from "./userdashboard/pages/Landingpage";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Landingpage />
//     </BrowserRouter>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Import global styles
import "./styles/global.css";

import Landingpage from "./userdashboard/pages/Landingpage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Landingpage />
    </BrowserRouter>
  </StrictMode>
);
