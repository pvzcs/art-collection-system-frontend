// Axios client configuration placeholder
// Will be implemented in task 2.2

import axios from 'axios';

const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
