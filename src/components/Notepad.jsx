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

  const handleChange = (e) => {
    setContent(e.target.value);
    setDoc(paragraphRef, { text: e.target.value });
  };

  return (
    <textarea
      className="fullscreen-textarea"
      value={content}
      onChange={handleChange}
      placeholder={`Start typing in ${username}'s notepad...`}
    />
  );
}
