const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Placeholder for the download route (we'll add in Phase 3)
app.post('/download', (req, res) => {
    const videoUrl = req.body.url;
    // Logic for downloading will go here (Phase 3)
    res.json({ downloadUrl: '/path-to-download-file' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});