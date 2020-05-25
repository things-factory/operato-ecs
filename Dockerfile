# Use an official ubuntu image
FROM ubuntu:18.04
FROM node:12.16.2-stretch
# Use an official Python runtime as a parent image

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app
RUN apt-get update -o Acquire::CompressionTypes::Order::=gz
RUN apt-get upgrade -y

RUN echo "deb http://ftp.de.debian.org/debian sid main" > /etc/apt/sources.list

RUN apt-get update
# install nodejs@10
# RUN apt-get -y install curl dirmngr apt-transport-https lsb-release ca-certificates
# RUN curl -sL https://deb.nodesource.com/setup_10.x | bash

# RUN apt-get -y install nodejs
# RUN apt-get -y install wget

RUN apt-get install -y chromium

RUN apt-get install -y libcups2-dev 
RUN apt-get install -y libavahi-compat-libdnssd-dev 
# RUN apt-get install -y chromium-browser

# install manually all the missing libraries for chrome
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

RUN npm install -g cordova

# install chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

# Install needed packages
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run
CMD ["npm", "run", "serve"]