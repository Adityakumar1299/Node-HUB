import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


export default function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (username.trim() !== "") navigate(`/${username}`);
  };

  return (
    <div>
      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleEnter}>Enter</button>
    </div>
  );
}
