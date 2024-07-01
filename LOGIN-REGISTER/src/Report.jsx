import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Report = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    
    axios.get('http://localhost:3001/attendance/report', {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      setReport(response.data);
    })
    .catch(error => {
      console.error("Error fetching report data:", error);
    });
  }, []);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Attendance Report</h1>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sign In Time</th>
                <th>Sign Out Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.signInTime ? new Date(entry.signInTime).toLocaleTimeString() : 'N/A'}</td>
                  <td>{entry.signOutTime ? new Date(entry.signOutTime).toLocaleTimeString() : 'N/A'}</td>
                  <td>{entry.signedIn ? 'Present' : 'Absent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
