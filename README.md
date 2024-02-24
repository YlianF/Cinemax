# Cinémax ! 🎥🎬

## C'est quoi ?

Une super application web qui permet de consulter ses films préférés et se tenir au courant des dernières sorties cinématographiques ☝️🤓

## On fait quoi dessus ?

On peut se créer un compte super sécurisé avec un algorithme de chiffrement de mot de passe (c'est du sha1 donc ouais bof ☝️🤓) et on peut voir des films et les mettre dans ses favoris.

## Mais comment se tenir informé ??

En étant spammé de mails !!  
Un mail à l'inscription, un autre quand un nouveau film est ajouté, encore un quand un de vos films favoris est modifié, quand un admin modifie ou supprime votre profil, quand vous supprimez votre compte.  
J'adore les mails (~~j'espère que vous aussi~~)

## Et les admins ils peuvent voir les films plus simplement ?

Une question étrangement spécifique, merci moi !  
Oui les admin peuvent voir les films dans un fichier CSV envoyé par MAIL (yes). Pour quoi faire ? J'en ai aucune idée

# Setup le projet ☝️🤓 :

Besoin d'avoir NodeJS (version 20.11.0)  

Installer les dépendances (pour les 0 personnes qui ne connaissent pas la commande) :
```
npm i
```

Pull les 2 dockers dont on va se servir :
```
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8

docker run -it --rm --name hapi-rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:3.13-management
```

Démarrer le serveur de mails : 
```
node mailer.js
```

Démarrer l'application : 
```
npm start
```

L'application est lancée et sera disponible à l'adresse http://localhost:3000  
(pour voir la documentation : http://localhost:3000/documentation)
