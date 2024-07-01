import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Report = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/attendance/report').then(response => {
      setReport(response.data);
    });
  });

  return (
    <div>
      <h1>Attendance Report</h1>
      <table>
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
  );
};

export default Report;
