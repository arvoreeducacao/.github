FROM ubuntu:latest
RUN apt-get update -y && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-setuptools \
        groff \
        less \
    && pip3 install --upgrade pip \
    && apt-get clean && curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash 
    
RUN pip3 --no-cache-dir install --upgrade awscli

CMD ["/bin/bash"]
WORKDIR /app

COPY run.sh .

