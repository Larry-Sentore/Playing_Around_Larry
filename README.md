Here’s a comprehensive `README.md` file tailored to your project:

---

# 🎵 Larry's Song Recommender App

This web app recommends Spotify songs based on an artist name input by the user. It fetches real-time data from two RapidAPI endpoints and renders song suggestions with a sleek, glassmorphic UI.

---

## 🚀 Features

* Search for an artist name
* View recommended songs with:

  * Album art
  * Title
  * Artist name
  * Duration
  * Spotify link
* Animated, glass-like card UI
* Load-balanced across multiple containers
* Fully Dockerized deployment

---

## 🛠 Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** N/A (static frontend with client-side API requests)
* **Containerization:** Docker, Docker Compose
* **Load Balancing:** HAProxy
* **API Services:**

  * [Spotify Scraper by DataFanatic](https://rapidapi.com/DataFanatic/api/spotify-scraper/playground/apiendpoint_f8c99f2c-6fcd-4fe6-917e-3fdfc5ef6a18)
  * [Spotify23 by Glavier](https://rapidapi.com/Glavier/api/spotify23/playground/apiendpoint_a216a745-27d1-40c9-8600-8217b8c9978b)

---

## 📦 Setup Instructions

### ✅ Prerequisites

* Docker installed on your machine
* A [RapidAPI](https://rapidapi.com) account with keys for the APIs above
* (Optional) Docker Hub account for pushing images

---

## 💻 Running the App Locally

1. **Clone the Repository**

   ```bash
   git clone <your-repo-url>
   cd larry_song_recommender
   ```

2. **Add Your API Key**

   Create a `.env` file at the root:

   ```
   X_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

3. **Run the App**

   ```bash
   chmod +x run.sh
   ./run.sh
   ```

   This sets the environment variable and builds the Docker image.

4. **Access Locally**

   Visit [http://localhost:8080](http://localhost:8080) to use the app.

---

## 🌐 Deploying to Web Servers (web-01, web-02, lb-01)

### 1. Build and Push Docker Image

```bash
docker build -t <your-dockerhub-username>/larry_song_recommender:v1 .
docker push <your-dockerhub-username>/larry_song_recommender:v1
```

### 2. SSH Into Web Servers

```bash
ssh your-user@web-01
ssh your-user@web-02
```

### 3. On Both `web-01` and `web-02`

```bash
docker pull <your-dockerhub-username>/larry_song_recommender:v1

docker run -d --name app --restart unless-stopped \
  -p 8080:80 \
  -e INSTANCE_ID=web-01 \
  <your-dockerhub-username>/larry_song_recommender:v1
```

Repeat for `web-02` (change `INSTANCE_ID=web-02`)

### 4. On `lb-01`

Update `haproxy.cfg` like so:

```haproxy
backend webapps
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

Then run:

```bash
docker run -d --name lb-01 --network webnet \
  -p 8080:80 \
  -v $(pwd)/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro \
  haproxy:alpine
```

Reload HAProxy if needed:

```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /usr/local/etc/haproxy/haproxy.cfg'
```

---

## 🧪 Load Balancing Test

Refresh [http://localhost:8080](http://localhost:8080) multiple times. You should see `Served by: web-01` or `web-02` alternating in the footer. This proves HAProxy is balancing traffic.

---

## 🗂 File Structure

```bash
├── Dockerfile
├── docker-compose.yml
├── .env              # Your API key (gitignored)
├── .dockerignore
├── api.template.js   # Template with env placeholder
├── index.template.html
├── run.sh
├── haproxy.cfg
└── ...
```

---

## 🔐 API Key Management

* Your API key is stored in `.env` and is **never committed to Git**.
* It is injected into the container as an environment variable via `docker run` or `docker-compose`.

---

## 📚 Credits

* **Spotify Scraper API** by [DataFanatic](https://rapidapi.com/DataFanatic/api/spotify-scraper)
* **Spotify23 API** by [Glavier](https://rapidapi.com/Glavier/api/spotify23)
* Thanks to [HAProxy](http://www.haproxy.org/) for simple load balancing

---

## ⚠️ Challenges & Solutions

| Challenge                                        | Solution                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| CORS and browser restrictions on static frontend | Used RapidAPI endpoints with proper headers                              |
| Hiding API key from frontend                     | Used `envsubst` and environment variables injected into static templates |
| Docker load balancing setup                      | Used HAProxy and Docker bridge network with semantic instance names      |

---

## 👤 Author

**Larry**
GitHub: [@larninja](https://github.com/larninja)
Docker Hub: [larninja](https://hub.docker.com/u/larninja)

---

Let me know if you'd like this generated as a file or auto-saved into your project!
