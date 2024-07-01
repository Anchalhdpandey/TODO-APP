// Example: Admin.js (React Component)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users').then(response => {
      setUsers(response.data);
    });
  }, []);

  const viewUserReport = (userId) => {
    window.location.href = `/admin/report/${userId}`;
  };

  return (
    <div>
      <h1>Admin Report Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => viewUserReport(user._id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
