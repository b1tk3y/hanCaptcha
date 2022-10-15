FROM python:3.11.0rc1-slim-buster

ENV PYTHONUNBUFFERED 1
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y
RUN apt-get install build-essential procps libpq-dev -y

WORKDIR /app
COPY . .

#RUN pip install -r /app/requirements.txt --no-cache-dir
RUN pip install -r /app/requirements.txt

