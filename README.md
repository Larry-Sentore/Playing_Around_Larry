🎵 Larry's Song Recommender App

This web app recommends Spotify songs based on an artist name input by the user. It fetches real-time data from two RapidAPI endpoints (one gets the playlist, the other and renders song suggestions and provides a playist link

🚀 Features

Search for an artist's name

View recommended songs with:

Album art

Title

Artist name

Duration

Spotify link

Load-balanced across multiple containers

🛠 API Services:

Spotify Scraper by DataFanatic

Spotify23 by Glavier

📦 Setup Instructions

💻 Running the App Locally

1. Clone the Repository
   
2. run the run.sh file

3. Run the app


🌐 Deploying to Web Servers (web-01, web-02, lb-01)
1. Build and Push Docker Image
bash
Copy
Edit
docker build -t <your-dockerhub-username>/larry_song_recommender:v1 .
docker push <your-dockerhub-username>/larry_song_recommender:v1

3. SSH Into Web Servers
bash
Copy
Edit
ssh your-user@web-01
ssh your-user@web-02
4. On Both web-01 and web-02
bash
Copy
Edit
docker pull <your-dockerhub-username>/larry_song_recommender:v1

docker run -d --name app --restart unless-stopped \
  -p 8080:80 \
  -e INSTANCE_ID=web-01 \
  <your-dockerhub-username>/larry_song_recommender:v1
Repeat for web-02 (change INSTANCE_ID=web-02)

4. On lb-01
Update haproxy.cfg like so:

haproxy
Copy
Edit
backend webapps
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
Then run:

bash
Copy
Edit
docker run -d --name lb-01 --network webnet \
  -p 8080:80 \
  -v $(pwd)/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro \
  haproxy:alpine
Reload HAProxy if needed:

bash
Copy
Edit
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /usr/local/etc/haproxy/haproxy.cfg'
🧪 Load Balancing Test
Refresh http://localhost:8080 multiple times. You should see Served by: web-01 or web-02 alternating in the footer. This proves HAProxy is balancing traffic.

🗂 File Structure
bash
Copy
Edit
├── Dockerfile
├── docker-compose.yml
├── .env              # Your API key (gitignored)
├── .dockerignore
├── api.template.js   # Template with env placeholder
├── index.template.html
├── run.sh
├── haproxy.cfg
└── ...
🔐 API Key Management
Your API key is stored in .env and is never committed to Git.

It is injected into the container as an environment variable via docker run or docker-compose.

📚 Credits
Spotify Scraper API by DataFanatic

Spotify23 API by Glavier

Thanks to HAProxy for simple load balancing

⚠️ Challenges & Solutions
Challenge	Solution
CORS and browser restrictions on static frontend	Used RapidAPI endpoints with proper headers
Hiding API key from frontend	Used envsubst and environment variables injected into static templates
Docker load balancing setup	Used HAProxy and Docker bridge network with semantic instance names

👤 Author
Larry
GitHub: @larninja
Docker Hub: larninja

Let me know if you'd like this generated as a file or auto-saved into your project!













