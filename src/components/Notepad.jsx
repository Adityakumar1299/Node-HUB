import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import "../App.css";

export default function Notepad() {
  const { username } = useParams();
  const [content, setContent] = useState("");
  const paragraphRef = doc(db, "notepads", username);

  useEffect(() => {
    const unsubscribe = onSnapshot(paragraphRef, (docSnap) => {
      if (docSnap.exists()) setContent(docSnap.data().text);
    });
    return () => unsubscribe();
  }, [username]);

  // Debounce function
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDoc(paragraphRef, { text: content });
    }, 500); // save every 500ms after typing stops
    return () => clearTimeout(timeout);
  }, [content]);

  return (
    <textarea
      className="fullscreen-textarea"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder={`Start typing in ${username}'s notepad...`}
    />
  );
}
