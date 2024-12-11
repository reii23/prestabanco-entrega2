comandos para kubernetes

DELETE (eliminar):
- kubectl delete deployments --all
- kubectl delete services --all
- kubectl delete configmap postgres-config-map
- kubectl delete secrets --all
- kubectl delete pv --all
- kubectl delete db-request-ms-request-deployment-service
- kubectl delete db-users-ms-request-deployment-service

GET (obtener estados):
- kubectl get pods
- kubectl get pv
- kubectl get pvc
- kubectl get configmap

APPLY (subir los yaml):
en deployment:
- kubectl apply -f postgres-config-map.yaml
- kubectl apply -f postgres-secrets.yaml
- kubectl apply -f request-db-deployment-service.yaml
- kubectl apply -f users-db-deployment-service.yaml
- kubectl apply -f config-server-deployment-service.yaml
- kubectl apply -f eureka-server-deployment-service.yaml
- kubectl apply -f gateway-server-deployment-service.yaml
- kubectl apply -f ms-users-deployment-service.yaml
- kubectl apply -f ms-request-deployment-service.yaml
- kubectl apply -f ms-simulation-deployment-service.yaml
- kubectl apply -f ms-evaluation-deployment-service.yaml
- kubectl apply -f ms-tracking-deployment-service.yaml
- kubectl apply -f ms-totalcost-deployment-service.yaml
- kubectl apply -f frontend-server-deployment-service.yaml

DATABASE (si quiero agregar alguna base de datos):
- kubectl exec -it (name-pod) -- /bin/bash
- psql -U postgres
- \l 
- CREATE DATABASE "(name-database)"

Consideraciones:
- Al momento de subir los pods: se debe crear una base de datos en ms-request llamada "request-db" y en ms-users una base de datos llamada "users-db"
- En request-db se debe completar los datos de los tipos de préstamos lona_type con los datos de querys.sql
- Se deben actualizar las rutas en el frontend dependiendo los puertos generados y en el evaluate para obtener los pdf
