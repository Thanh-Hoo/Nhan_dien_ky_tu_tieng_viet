FROM nvidia/cuda:10.2-cudnn8-devel-ubuntu18.04

COPY . /CRAFT/
WORKDIR /CRAFT/
RUN apt-get update \
    && apt-get install python3.8 -y \
    && apt-get update \
    && apt-get install python3-pip -y \
    && python3 -m pip install --upgrade pip \
    && apt-get update \
    && apt install -y libgl1-mesa-glx \
    && pip3 install -r requirements.txt
