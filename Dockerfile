FROM ubuntu:latest

RUN echo sudo apt update
RUN echo sudo apt install openjdk-8-jdk -y
RUN java -version
