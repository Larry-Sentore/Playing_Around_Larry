const X_RapidAPI_Key = 

document.getElementById('search-button').addEventListener('click', async () => {
    const input = document.getElementById('url').value.trim();
    if (!input) {
        alert("Please enter a Spotify artist URL or artist name.");
        return;
    }
    //delete previous results
    const existingResults = document.querySelector('.results');
    if (existingResults) {
        existingResults.remove();
    }

    let uri;

    // Check if it's a Spotify URL
    if (input.includes('spotify.com/artist/')) {
        const artistId = input.split('spotify.com/artist/')[1].split('?')[0];
        uri = `spotify:artist:${artistId}`;
    } else {
        // Search for the artist
        const searchUrl = `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(input)}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
        const searchOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': X_RapidAPI_Key,
                'x-rapidapi-host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const searchResponse = await fetch(searchUrl, searchOptions);
            const searchData = await searchResponse.json();

            const artist = searchData.artists?.items?.[0]?.data;
            if (!artist || !artist.uri) {
                alert("No matching artist found.");
                return;
            }
            uri = artist.uri;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const encodedUri = encodeURIComponent(uri);

    // Get playlist URI
    const seedUrl = `https://spotify23.p.rapidapi.com/seed_to_playlist/?uri=${encodedUri}`;
    const seedOptions = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': X_RapidAPI_Key,
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const seedResponse = await fetch(seedUrl, seedOptions);
        const seedData = await seedResponse.json();

        const playlistUri = seedData?.mediaItems?.[0]?.uri;
        if (!playlistUri) {
            alert('No playlist found.');
            return;
        }

        const playlistId = playlistUri.replace("spotify:playlist:", "");

        // STEP 2: Get playlist content
        const contentUrl = `https://spotify-scraper.p.rapidapi.com/v1/playlist/contents?playlistId=${playlistId}`;
        const contentOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': X_RapidAPI_Key,
                'x-rapidapi-host': 'spotify-scraper.p.rapidapi.com'
            }
        };

        const contentResponse = await fetch(contentUrl, contentOptions);
        const data = await contentResponse.json();

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'results glass-box';
        resultsDiv.innerHTML = `<h2>Recommended Songs: <div class="playlists"><a href="${playlistUri}" target="_blank">Go to Playlist</a></div>`;
        const list = document.createElement('ul');

        data.contents.items.forEach(item => {
            if (item.type === 'track') {
                const songName = item.name;
                const artistName = item.artists?.[0]?.name;
                const duration = item.durationText;
                const shareUrl = item.shareUrl;
                const coverImage = item.album?.cover?.[0]?.url;

                const li = document.createElement('li');
                li.className = 'song-item';
                li.innerHTML = `
                    <img src="${coverImage}" alt="Cover image">
                    <div class="song-info"><strong>${songName}</strong> by ${artistName} — ${duration}</div>
                    <div class="link"><a href="${shareUrl}" target="_blank">Listen</a></div>
                `;
                list.appendChild(li);
            }
        });

        resultsDiv.appendChild(list);
        document.querySelector('.container').appendChild(resultsDiv);

    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Check console for details.');
    }
});
