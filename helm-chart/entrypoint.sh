#!/bin/sh

set -xe

sh -c "aws configure set aws_access_key_id ${aws_access_key_id}"
sh -c "aws configure set aws_secret_access_key ${aws_secret_access_key}"
sh -c "aws configure set region ${aws_region}"

echo "$KUBE_CONFIG_DATA" | base64 --decode > /tmp/config
export KUBECONFIG=/tmp/config

sh -c "$*"