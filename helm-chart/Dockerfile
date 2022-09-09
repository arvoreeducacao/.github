# eks version
FROM alpine/k8s:1.18.2

RUN apk add --update \
        coreutils \
        curl \
        py-pip

RUN pip install awscli


RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 \
    && chmod +x get_helm.sh && ./get_helm.sh

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]


