import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleEnter = (e) => {
    e.preventDefault(); // prevent page reload
    if (username.trim() !== "") navigate(`/${username}`);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1 className="app-title">Nord-HUB</h1>
        <p className="tagline">Your real-time collaborative notepad</p>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <h2>Start Writing Instantly</h2>
        <p className="description">
          Enter a username to create or join a shared workspace. No signup
          required — your notes sync automatically in real time.
        </p>

        {/* Form handles Enter key */}
        <form onSubmit={handleEnter} className="input-group">
          <input
            className="username-input"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="enter-button">
            Enter
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          ⚠️ Disclaimer: Notes are stored in a shared environment and may not be
          fully secure. Please avoid saving sensitive information.
        </p>
        <p className="footer-credit">© {new Date().getFullYear()} Nord-HUB</p>
      </footer>
    </div>
  );
}
