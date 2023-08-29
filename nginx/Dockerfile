FROM nginx

EXPOSE 80

# Removing custom default html file of nginx
RUN rm /usr/share/nginx/html/*

# Copying custom config file to nginx
COPY configs/default.conf /etc/nginx/conf.d/default.conf

# We want nginx to run on foreground not the daemon
CMD [ "nginx","-g","daemon off;" ]