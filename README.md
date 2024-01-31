comment regler l'erreur de con : 

pour le docker : 

```
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8
```

le port 3306 est meme pas pris mais jsp pk il clc doc on le map sur 3307

ensuite on a un pb : 
```
Fatal exception: Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
```

solution : 
https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server

pour l'instant j'ai fait la solution degueu, a voir si c'est important