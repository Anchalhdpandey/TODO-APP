import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:3001/attendance/today", {
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
        "http://localhost:3001/attendance/signin",
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
        "http://localhost:3001/attendance/signout",
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
    <div className="container mt-5">
      <div className="card">
        <div className="card-body text-center">
          <h1 className="card-title">Welcome</h1>
          <p className="card-text">Current Date and Time: {currentTime.toLocaleString()}</p>
          {signedIn ? (
            <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
          ) : (
            <button className="btn btn-success" onClick={handleSignIn}>Sign In</button>
          )}
          <button className="btn btn-primary ml-3" onClick={() => (window.location.href = "/report")}>
            View Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
