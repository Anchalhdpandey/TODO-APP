import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if the user has already signed in today
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:3001/api/attendance/today", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setSignedIn(response.data.signedIn);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  }, []);

  const handleSignIn = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .post(
        "http://localhost:3001/api/attendance/signin",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setSignedIn(true);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const handleSignOut = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .post(
        "http://localhost:3001/api/attendance/signout",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setSignedIn(false);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div>
      <h1>Welcome</h1>
      <p>Current Date and Time: {currentTime.toLocaleString()}</p>
      {signedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      <button onClick={() => (window.location.href = "/report")}>
        View Report
      </button>
    </div>
  );
};

export default Home;
