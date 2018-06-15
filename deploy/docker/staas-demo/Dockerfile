# This is demo
FROM zmat/nemea-supervisor-sysrepo-edition:0.3

# Install Angular
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash - && \
    yum install -y nodejs && npm install --unsafe-perm -g @angular/cli

# Install Python dependencies for backend
RUN dnf install -y python3-pip python3-devel libffi-devel mongodb-server

# Install dependencies for production Liberouter GUI environment
RUN dnf install -y httpd-devel
RUN pip3 install mod_wsgi
RUN mod_wsgi-express module-config >/etc/httpd/conf.modules.d/00-wsgi.conf
ARG CACHE_DATE=2018-04-24.3
COPY httpd.conf /etc/httpd/conf/httpd.conf

# Install STaaS GUI
RUN cd /var/www && \
  git clone -b devel https://github.com/CESNET/liberouter-gui && cd liberouter-gui/modules && \
  rm -r example/ && mkdir -p assets/img/ && touch assets/img/logo.png && \
  git clone https://github.com/CESNET/Staas-GUI && mv Staas-GUI/* . && \
  rm -rf NEMEA/ Staas-GUI/ examples/ 
COPY wsgi.py /var/www/liberouter-gui/backend/wsgi.py

# Install NEMEA GUI
RUN cd /var/www/liberouter-gui/modules && \
  git clone -b devel https://github.com/jakubman1/nemea-gui nemea/ && \
  cd ../ && python3 bootstrap.py && cd frontend/ && npm install --allow-root && \
  cd ../ && pip3 install -r backend/requirements.txt

# Expose httpd 
EXPOSE 80/tcp

# Build frontend files
WORKDIR /var/www/liberouter-gui/frontend
RUN ng build --prod --base-href="/"
RUN cp -R dist/* /var/www/html/
RUN chown -R apache:apache /var/www/

ARG CACHE_DATE=2018-05-25.2
COPY run_services.sh /root
CMD ["/bin/bash", "/root/run_services.sh"]
