// Example: UserReport.js (React Component)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserReport = () => {
  const { userId } = useParams();
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/admin/user/${userId}/report`).then(response => {
      setReport(response.data);
    });
  }, [userId]);

  return (
    <div>
      <h1>User Attendance Report</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {report.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.signedIn ? 'Present' : 'Absent'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReport;
