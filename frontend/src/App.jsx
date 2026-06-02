import { useState } from "react";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import "../styles/global.css";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <Dashboard />;
}
