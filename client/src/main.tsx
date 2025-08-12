import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 main.tsx loading");

const container = document.getElementById("root");
if (!container) {
  console.error("❌ Failed to find root element");
  throw new Error("Failed to find the root element");
}

console.log("✅ Root element found, creating React root");
const root = createRoot(container);

// Simple test first
const TestComponent = () => {
  return React.createElement("div", {
    style: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "red",
      color: "white",
      fontSize: "24px",
      padding: "20px",
      zIndex: 9999
    }
  }, "EMERGENCY TEST - CAN YOU SEE THIS?");
};

console.log("🎯 Rendering test component");
root.render(React.createElement(TestComponent));
