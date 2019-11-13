FROM nginx:latest AS web

# ports
EXPOSE 80
EXPOSE 8080

# copy nginx config
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

# copy static files
COPY --chown=nginx:nginx ./dist /var/www/web

