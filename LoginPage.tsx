import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // NOTE: No redirect, no validation, no API call
  const handleLogin = () => {
    console.log("Login clicked", { email, password });
   
  };

  return (
    <div style={{ padding: 10 }}>
      <h2>User Login</h2>

      <div>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>

      <div style={{ marginTop: 25 }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      <button onClick={handleLogin} style={{ marginTop: 45 }}>
        Login
      </button>
    </div>
  );
}
