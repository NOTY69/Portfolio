const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// API endpoint for projects
app.get('/api/projects', (req, res) => {
  res.json([
    { title: 'Bike Tribe', description: 'A biking community blog', link: 'biketribeblog.html' },
    // Add more projects here if needed
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
