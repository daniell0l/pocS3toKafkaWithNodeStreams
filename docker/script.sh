#!/bin/sh

############################
### Por: Paulo Vaz       ###
### created: 05/04/23    ###
### updated: 05/04/23    ###
############################

## Para funcionar o s3 e o RDS localmente, deve seguir esse procedimento:
# 1 - Criar as credenciais
#  aws configure --profile default //aws_access_key_id = local aws_secret_access_key = locallocal
# 2 - Rodar o docker-composer, nesse projeto só tem o s3 e RDS postegress
# 3 - Depois de subir o docker, criar as tabelas
# 4 - Criar o bucket
# 5 - Crie um .env.local. Obs: As credencias do RDS deverá está no .env.local
# 6 - Rode o serverless com o seguinte comando 'npx sls offline start --stage local --config serverless-local.yml'
# 7 - No caso do postgres seria melhor ter um sql para ser importado.

#Criar queues
aws sqs --endpoint-url=http://127.0.0.1:9324 create-queue \
            --queue-name generate-report-costs-sqs

aws sqs send-message --endpoint-url=http://127.0.0.1:9324 --queue-url http://127.0.0.1:9324/000000000000/generate-report-costs-sqs --message-body '{"solicitationId":"28224157-e580-4396-ac58-1b681a3cf517"}'

#Listar a queues
aws --endpoint-url=http://127.0.0.1:9324 sqs list-queues

#Limpar a fila
aws --endpoint-url=http://127.0.0.1:9324 sqs purge-queue --queue-url http://127.0.0.1:9324/000000000000/generate-report-costs-sqs

# Create bucket
aws --endpoint-url=http://127.0.0.1:9000 s3api create-bucket --bucket mensageria-sms-csvs-local

#Copiar um arquivo do bucket para a maquina local
aws s3 --endpoint-url=http://127.0.0.1:9000 cp s3://path_file.csv .

# List buckets
aws --endpoint-url=http://127.0.0.1:9000 s3api list-buckets

# List bucket files
aws --endpoint-url=http://127.0.0.1:9000 s3 ls s3://mensageria-sms-csvs-local

# Copy local object to bucket
aws --endpoint-url=http://127.0.0.1:9000 s3 cp sms-6024.csv s3://mensageria-sms-csvs-uat/

