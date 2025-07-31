# Use Nginx to serve static files
FROM nginx:alpine

# Set environment variable for the port (optional)
ENV PORT=8080

# Copy static files into the default nginx public folder
COPY ./ /usr/share/nginx/html

# Expose port (configurable via ENV, but default is 8080)
EXPOSE ${PORT}

# Start Nginx (Nginx listens on 80 inside container by default)
CMD ["nginx", "-g", "daemon off;"]

