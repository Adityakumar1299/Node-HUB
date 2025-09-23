
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

export default function Notepad() {
  const { username } = useParams();
  const [content, setContent] = useState("");
  const [userId] = useState(uuidv4()); // unique per session
  const [userColor] = useState(
    "#" + Math.floor(Math.random() * 16777215).toString(16) // random color
  );

  const noteRef = useMemo(() => doc(db, "notepads", username), [username]);

  // Load initial doc & sync in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(noteRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.content) setContent(data.content);
      }
    });
    return () => unsubscribe();
  }, [noteRef]);

  // Update Firestore when content changes
  const handleChange = async (val, delta, source) => {
    setContent(val);
    if (source === "user") {
      await setDoc(
        noteRef,
        {
          content: val,
          users: {
            [userId]: { name: username, color: userColor },
          },
        },
        { merge: true }
      );
    }
  };

  return (
    <div className="editor-container">
      <ReactQuill
        value={content}
        onChange={handleChange}
        placeholder={`Start typing, ${username}...`}
        theme="snow"
      />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { db } from "../firebase/firebaseConfig";
// import { doc, onSnapshot, setDoc } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import "../App.css";

// export default function Notepad() {
//   const { username } = useParams();
//   const [content, setContent] = useState("");
//   const paragraphRef = doc(db, "notepads", username);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(paragraphRef, (docSnap) => {
//       if (docSnap.exists()) setContent(docSnap.data().text);
//     });
//     return () => unsubscribe();
//   }, [username]);

//   // Debounce function
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDoc(paragraphRef, { text: content });
//     }, 500); // save every 500ms after typing stops
//     return () => clearTimeout(timeout);
//   }, [content]);

//   return (
//     <textarea
//       className="fullscreen-textarea"
//       value={content}
//       onChange={(e) => setContent(e.target.value)}
//       placeholder={`Start typing in ${username}'s notepad...`}
//     />
//   );
// }

// // 
// // import { useEffect, useState } from "react";
// // import { db } from "../firebase/firebaseConfig";
// // import {
// //   doc,
// //   getDoc,
// //   setDoc,
// //   updateDoc,
// //   onSnapshot,
// //   serverTimestamp,
// // } from "firebase/firestore";
// // import { useParams } from "react-router-dom";
// // import "../App.css";

// // export default function Notepad() {
// //   const { username } = useParams();

// //   const [displayName, setDisplayName] = useState("");
// //   const [safeDisplayName, setSafeDisplayName] = useState("");
// //   const [showInput, setShowInput] = useState(true);
// //   const [userColor, setUserColor] = useState("");
// //   const [content, setContent] = useState("");
// //   const [allUsers, setAllUsers] = useState({});
// //   const [activeUsers, setActiveUsers] = useState([]);

// //   const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
// //   const docRef = doc(db, "notepads", username);

// //   // Sanitize displayName for Firestore keys
// //   const sanitizeName = (name) => {
// //     return name.replace(/[.#$/\[\]:=]/g, "_"); // Firestore key safe
// //   };

// //   // Handle displayName input
// //   const handleDisplayName = async () => {
// //     if (!displayName.trim()) return;

// //     const cleanName = sanitizeName(displayName);
// //     setSafeDisplayName(cleanName);

// //     const docSnap = await getDoc(docRef);

// //     if (docSnap.exists()) {
// //       const data = docSnap.data();
// //       if (data.users && data.users[cleanName]) {
// //         setUserColor(data.users[cleanName].color);
// //       } else {
// //         const color = colors[Math.floor(Math.random() * colors.length)];
// //         setUserColor(color);
// //         await updateDoc(docRef, {
// //           [`users.${cleanName}`]: {
// //             color,
// //             lastActive: serverTimestamp(),
// //             lastText: "",
// //           },
// //         }).catch(async () => {
// //           await setDoc(docRef, {
// //             users: { [cleanName]: { color, lastActive: serverTimestamp(), lastText: "" } },
// //             content: "",
// //           });
// //         });
// //       }
// //       setContent(data.content || "");
// //     } else {
// //       // First user → create doc
// //       const color = colors[Math.floor(Math.random() * colors.length)];
// //       setUserColor(color);
// //       await setDoc(docRef, {
// //         content: "",
// //         users: {
// //           [cleanName]: { color, lastActive: serverTimestamp(), lastText: "" },
// //         },
// //       });
// //       setContent("");
// //     }

// //     setShowInput(false);
// //   };

// //   // Save content (shared text for all users)
// //   useEffect(() => {
// //     if (!safeDisplayName) return;
// //     const timeout = setTimeout(async () => {
// //       await updateDoc(docRef, {
// //         content,
// //         [`users.${safeDisplayName}.lastText`]: content.slice(-30), // store last 30 chars
// //         [`users.${safeDisplayName}.lastActive`]: serverTimestamp(),
// //         [`users.${safeDisplayName}.color`]: userColor,
// //       }).catch(() => {});
// //     }, 400);

// //     return () => clearTimeout(timeout);
// //   }, [content, safeDisplayName, userColor]);

// //   // Listen for changes (content + users)
// //   useEffect(() => {
// //     const unsubscribe = onSnapshot(docRef, (docSnap) => {
// //       if (docSnap.exists()) {
// //         const data = docSnap.data();
// //         setContent(data.content || "");
// //         setAllUsers(data.users || {});

// //         // active users = those updated in last 30s
// //         const now = Date.now();
// //         const actives = Object.entries(data.users || {})
// //           .filter(([_, u]) => u.lastActive?.toMillis && now - u.lastActive.toMillis() < 30000)
// //           .map(([name]) => name);
// //         setActiveUsers(actives);
// //       }
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   if (showInput) {
// //     return (
// //       <div className="center-box">
// //         <h2>Enter your display name</h2>
// //         <input
// //           placeholder="Display Name"
// //           value={displayName}
// //           onChange={(e) => setDisplayName(e.target.value)}
// //         />
// //         <button onClick={handleDisplayName}>Enter Notepad</button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="notepad">
// //       {/* Active users badges */}
// //       <div className="active-users">
// //         {activeUsers.map((name) => (
// //           <span key={name} className="user-badge">
// //             {name}
// //           </span>
// //         ))}
// //       </div>

// //       {/* User logs */}
// //       <div className="users-log">
// //         <h3>User Activity</h3>
// //         {Object.entries(allUsers).map(([name, data]) => (
// //           <div key={name} className="user-log-item">
// //             <strong style={{ color: data.color }}>{name}</strong>{" "}
// //             <span style={{ color: "#444" }}>
// //               {data.lastText || "..."} —{" "}
// //               {data.lastActive?.toDate
// //                 ? new Date(data.lastActive.toDate()).toLocaleTimeString()
// //                 : ""}
// //             </span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Shared textarea */}
// //       <textarea
// //         className="fullscreen-textarea"
// //         value={content}
// //         onChange={(e) => setContent(e.target.value)}
// //         placeholder={`Start typing in ${username}'s notepad...`}
// //       />
// //     </div>
// //   );
// // }
