import { useState } from "react";
import { authFetch } from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await authFetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } else {
      alert("Login failed");
    }
  };

  const handleGuestLogin = async () => {
    const res = await authFetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } else {
      alert("Guest login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2">
        <button type="submit">Login</button>
        <button type="button" onClick={handleGuestLogin}>
          Login as Guest
        </button>
      </div>
    </form>
  );
}
