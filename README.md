# .github
Github Actions Central 

Esse repositório tem como objetivo centralizar Actions do Github e disponibilizar steps simplificados e preparados para CI/CD.



## Atenção

Nunca versione chaves, senhas, logins, ips ou qualquer informação sensível a esse repositório. Pois o mesmo é publico. Todas as informações sensiveis são gravadas e configuradas via Secrets da AWS ou do Github. Solicite a um administrador caso precise incluir, alterar ou deletar alguma dessas informações sensíveis.


## Gitleaks

Workflow `.github/workflows/gitleaks.yml`, exigido em todo PR da organização por um ruleset. Ele baixa o gitleaks com versão fixa, confere o checksum e varre só os commits do PR (`base..head`), com o valor do segredo mascarado no log. Se achar um segredo, o check falha.

Para liberar um falso positivo, adicione o `Fingerprint` que aparece no log em um arquivo `.gitleaksignore` na raiz do repositório do PR, uma linha por achado.

Para usar em outro workflow:

```yaml
jobs:
  gitleaks:
    uses: arvoreeducacao/.github/.github/workflows/gitleaks.yml@main
```


## Branch Filter

Action Simples para definição de branchs relacionadas a ambientes:


#### Inputs

-----

#### Outputs



### Exemplo de uso:

Abaixo um exemplo de uso:

```

```


## Config Backend

Action especifica para Pipeline Terraform que configura o Backend (key) do TFSTATE.



#### Inputs

-----

#### Outputs



### Exemplo de uso:

Abaixo um exemplo de uso:

```

```


## Docker Build and Push ECR Repository (old)

Action especifica para projetos que precisam fazer Build e Push de imagens Docker. 
Usado apenas como referencia, atualmente a action pode ser dispensada para rodar apenas os comandos básicos via shell mesmo

#### Inputs

-----

#### Outputs


#### Dependencias

* Depende da Action *login-ecr* no repositorio ws-actions/amazon-ecr-login@v1

### Exemplo de uso:

Abaixo um exemplo de uso:

```
      
```




## Front Sync

Front-Sync é uma action que faz sincronia dos arquivos para um bucket S3 e gera uma invalidação de cache junto ao cloudfront utilizando o ID da distribuição, utiliza Python3 (boto3, dateUtil, jmespath, s3 transfer, e urllib3).


#### Inputs

-----

#### Outputs



### Exemplo de uso:

Abaixo um exemplo de uso:

```

```



## Node Build

Action que faz build de aplicações feitas com NodeJS, utiliza Python3 para executar os comandos do Node via Shell e possui algumas regras simples, e também faz build de Lambdas e gera o pacote conforme padrão necessário respeitando regras das pastas node_modules.

#### Inputs

-----

#### Outputs



### Exemplo de uso:

Abaixo um exemplo de uso:

```

```



## Node Diff

Action que faz diff entre commits (old commits) e (current commit). Utiliza NodeJS e é focada para uso de pipelines de terraform

#### Inputs

-----

#### Outputs



### Exemplo de uso:

Abaixo um exemplo de uso:

```

```



## Setup AWS

Action faz toda a configuração de um profile AWS dentro de uma pipeline, configurando um arquivo no path ~/.aws/credentials com um profile correspondente ao ambiente (HML, PRD, Sandbox, etc).



#### Inputs

-----

#### Outputs



### Exemplo de uso:

Abaixo um exemplo de uso com diversas contas aws correspondentes aos ambientes:

```
 name: 🔐 Setup AWS Profile
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
```


