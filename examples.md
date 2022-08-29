
# Exemplos prontos. Pra já sair usando.


## Continuos Deployment Kubernetes Container

O Exemplo abaixo mostra como fazer um deploy em um cluster Kubernetes de um container


path: repositorio/.github/workflows/deployment_k8s.yml (pode dar o nome do arquivo como preferir).

O Exemplo abaixo utiliza a branch *develop* como gatilho para iniciar o workflow. Caso deseja usar Tags como estratégia, o bloco abaixo precisa ser descomentado e a key branches precisa ser comentada. 


```yaml
name: Deployment Container Kubernetes 
on:
  push:
    branches:
      - develop
    #  tags:
      # - staging-v*.*.*          # Push events to v1.0, v1.1.1, and v1.9.1 tags

env:
  RELEASE_REVISION: ${{ github.event.pull_request.head.sha }}
  AWS_REGION: "us-east-1"
  KUBE_CONFIG_DATA: ${{ secrets.HML_KUBE_CONFIG }}
  KUBE_NAMESPACE: default
  ECR_REPOSITORY: project_repository_ecr
  ENVIRONMENT: staging

jobs:
  deployment:
    # if: ${{ contains(github.ref, 'staging') }}
    name: Build Push and Deployment
    runs-on: [self-hosted, linux, x64]
    steps:
      - name: ❌ Cancel Previous Runs
        uses: styfle/cancel-workflow-action@0.4.1
        with:
          access_token: ${{ github.token }}

      - name: 🏗 Checkout
        uses: actions/checkout@v2
        with:
          ref: ${{ github.event.pull_request.head.sha }}

      - name: 🔐 Setup AWS Profile
        uses: arvoreeducacao/.github/actions/setup-aws-py@master
        with:
          aws_profile: hml
          root_path: ~/
        env:
          #DEV ENV
          ORG_TF_AWS_KEY_ID: ${{ secrets.ORG_TF_AWS_KEY_ID }}
          ORG_TF_AWS_SECRET_KEY: ${{ secrets.ORG_TF_AWS_SECRET_KEY }}
          #DEV ENV
          DEV_TF_AWS_KEY_ID: ${{ secrets.DEV_TF_AWS_KEY_ID }}
          DEV_TF_AWS_SECRET_KEY: ${{ secrets.DEV_TF_AWS_SECRET_KEY }}
          #HML ENV
          HML_TF_AWS_KEY_ID: ${{ secrets.HML_TF_AWS_KEY_ID }}
          HML_TF_AWS_SECRET_KEY: ${{ secrets.HML_TF_AWS_SECRET_KEY }}
          #PRD ENV
          PRD_TF_AWS_KEY_ID: ${{ secrets.PRD_TF_AWS_KEY_ID }}
          PRD_TF_AWS_SECRET_KEY: ${{ secrets.PRD_TF_AWS_SECRET_KEY }}


      - name: 🔐 Set and export AWS credentials in Shell
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.HML_TF_AWS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.HML_TF_AWS_SECRET_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: 📋 Set outputs
        id: vars
        run: echo "::set-output name=sha_short::$(git rev-parse --short HEAD)"
      - name: Check outputs
        run: echo ${{ steps.vars.outputs.sha_short }}

      - name: 👤 Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: 🚀 Build, tag, and push image to Amazon ECR
        id: build-push-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: api
          IMAGE_TAG: ${{ steps.vars.outputs.sha_short }}
        run: |
          docker build --build-arg ENVIRONMENT=${{ env.ENVIRONMENT }} -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - uses: bluwy/substitute-string-action@v1
        name: 🔎 Find and Replace
        id: sub
        with:
          _input-file: 'k8s_manifest_environment.yml'
          _format-key: '%%key%%'
          image_container: ${{ steps.login-ecr.outputs.registry }}/api:${{ steps.vars.outputs.sha_short }}

      - uses: DamianReeves/write-file-action@v1.0
        name: 📓 Write k8s_manifest_environment.yml
        with:
          path: k8s_manifest_environment.yml
          contents: ${{ steps.sub.outputs.result }}
          write-mode: overwrite

      - name: 🔄 Apply Manifest
        uses: jonathan-sh/kubectl@1.0.0
        env:
          kube_confg_data: ${{ secrets.HML_KUBE_CONFIG }}
          kube_namespace: default
          aws_access_key_id: ${{ secrets.HML_TF_AWS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.HML_TF_AWS_SECRET_KEY }}
          aws_region: "us-east-1"
        with:
          args: '"kubectl apply -f k8s_manifest_environment.yml"'

      - name: ✅ Verify deployment
        uses: jonathan-sh/kubectl@1.0.0
        env:
          kube_confg_data: ${{ secrets.HML_KUBE_CONFIG }}
          kube_namespace: default
          aws_access_key_id: ${{ secrets.HML_TF_AWS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.HML_TF_AWS_SECRET_KEY }}
          aws_region: "us-east-1"
        with:
          args: '"kubectl rollout status deployment/deployment-name-your-manifest"'

      - name: 🔄 Describe Deployments
        uses: jonathan-sh/kubectl@1.0.0
        env:
          kube_confg_data: ${{ secrets.HML_KUBE_CONFIG }}
          kube_namespace: default
          aws_access_key_id: ${{ secrets.HML_TF_AWS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.HML_TF_AWS_SECRET_KEY }}
          aws_region: "us-east-1"
        with:
          args: '"kubectl describe deployments"'
```

Agora é necessário gerar o arquivo de manifesto geral de sua aplicação. Vamos criar o arquivo *k8s_manifest_environment.yml*.

O Exemplo abaixo contém apenas os componentes de: Service, Deployment e HPA (Horizontal Pod AutoScaler). Por boas práticas é recomendável criar os recursos de Ingress e Secrets separado.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: project_name
spec:
  selector:
    app: project_name
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project_name
spec:
  replicas: 1
  selector:
    matchLabels:
      app: project_name
  template:
    metadata:
      labels:
        app: project_name
    spec:
      containers:
        - name: name-base-youy-container
          image: %%image_container%%
          # Caso precise, descomente as linhas abaixo e configure os recursos de memoria e CPU para as entradas de requests e Limits ( https://kubernetes.io/pt-br/docs/concepts/configuration/manage-resources-containers/ )
          # resources:
          #   requests:
          #     memory: "256Mi"
          #     cpu: "200m"
          #   limits:
          #     memory: "512Mi"
          #     cpu: "400m"
          ports:
            - containerPort: 3000
---
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: project_name
  namespace: default
  labels:
    app: project_name
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: project_name
  minReplicas: 1
  maxReplicas: 4
  targetCPUUtilizationPercentage: 50

```