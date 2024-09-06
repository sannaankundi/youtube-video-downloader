document.getElementById('download-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const videoUrl = document.getElementById('video-url').value;
    const responseMessage = document.getElementById('response-message');

    // Validate URL
    if (!videoUrl) {
        responseMessage.innerText = 'Please enter a valid YouTube URL';
        return;
    }

    // Send request to the server
    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = data.downloadUrl;
        } else {
            responseMessage.innerText = data.error;
        }
    } catch (error) {
        responseMessage.innerText = 'Something went wrong, please try again.';
    }
});
