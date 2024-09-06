const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Download route
app.post('/download', (req, res) => {
    const videoUrl = req.body.url;
    
    if (!videoUrl) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    const videoId = new Date().getTime(); // Unique ID for the video file
    const videoPath = path.join(downloadsDir, `${videoId}.mp4`);

    // Download the video using yt-dlp
    exec(`yt-dlp -f mp4 -o "${videoPath}" "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error downloading video:', error);
            return res.status(500).json({ error: 'Error downloading video' });
        }

        // Check if the video exists after download
        if (!fs.existsSync(videoPath)) {
            return res.status(500).json({ error: 'Failed to download video' });
        }

        // Send the video back to the client
        res.json({ downloadUrl: `/downloads/${videoId}.mp4` });
    });
});

// Serve downloaded files
app.use('/downloads', express.static(downloadsDir));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;
    
    if (!videoUrl) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const videoId = new Date().getTime(); // Unique ID for the video file
        const videoPath = path.join(__dirname, 'downloads', `${videoId}.mp4`);

        // Download the video using yt-dlp
        await ytdlp(videoUrl, {
            output: videoPath,
            format: 'mp4',
        });

        // Check if the video exists after download
        if (!fs.existsSync(videoPath)) {
            return res.status(500).json({ error: 'Failed to download video' });
        }

        // Send the video back to the client
        res.json({ downloadUrl: `/downloads/${videoId}.mp4` });

    } catch (error) {
        if (error.message.includes('URL')) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Server Error: Failed to download video' });
    }
});
