FROM ubuntu:latest

RUN apt-get update -y && \
    apt-get install -y \
        curl \ 
        python3 \
        python3-pip \
        python3-setuptools \
        groff \
        less \
    && pip3 install --upgrade pip \
    && apt-get clean
 
RUN curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg > /dev/null
RUN apt-get install apt-transport-https --yes
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
RUN apt-get update -y && apt-get install helm -y 

RUN pip3 --no-cache-dir install --upgrade awscli

CMD ["/bin/bash"]
WORKDIR /app

COPY run.sh .

