# 🎵 Larry's Song Recommender App

#The Song Recommender Web app is here to help users input an arist's name and recieve a playlist full of songs by the artist and with a similar vibe to the artist's music.

🚀 Features

Search an artist name then get a playlist with recommended songs

View recommended songs with:

Album art
Title
Artist name
Duration
Spotify link

Load-balanced across multiple containers

🛠 API Services 

Spotify Scraper API by DataFanatic
Spotify23 API by Glavier

💻 Running the App Locally

1. Clone the Repo
2. run run.sh
3. On Vs, install and run Live Server
4. Open a browser and navigate to http://localhost:5000

🌐 Deploying to Web Servers (web-01, web-02, lb-01)

1. Run these commands to built an image and push it to Docker Hub:

docker build -t <your-dockerhub-username>/larry_song_recommender:v1 .
docker push <your-dockerhub-username>/larry_song_recommender:v1

2. Run docker compose up --build -d

3. Tag your containers with this link

docker tag larry_song_recommender:latest <your-docherhub-username>/larry_song_recommender-lb-01:v1
docker tag larry_song_recommender:latest <your-docherhub-username>/larry_song_recommender-web-01:v1
docker tag larry_song_recommender:latest <your-docherhub-username>/larry_song_recommender-web-02:v1

4. Push the images to Docker Hub

docker push <your-dockerhub-username>/larry_song_recommender-lb-01:v1
docker push <your-dockerhub-username>/larry_song_recommender-web-01:v1
docker push <your-dockerhub-username>/larry_song_recommender-web-02:v1

5. Acess the app on these ports

 http://localhost:8081
 http://localhost:8082
 http://localhost:8080


 🧪 Load Balancing Test

View: Load_balancer_test.png

⚠️ Challenges

1. Hiding the API key. Put the api.js in a gitignore and its initialized when the app is run
2. Docker server config files: What to put in the config files was tricky but after some reaerach I figured it out.

👤 Author
Larry GitHub: @larninja Docker Hub: https://hub.docker.com/repositories/larninja


