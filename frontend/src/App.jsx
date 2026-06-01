import { useState } from "react";
import Login from "./Login";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <h1>You're logged in 🎉</h1>;
}
