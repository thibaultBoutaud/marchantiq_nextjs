


# MARCHANTIQ

## Site vitrine SSR


## Technos :

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

## Description:
Il y a une API restful en Nodejs-Express et un server couplé à une application Next.js.<br>
C'est un site vitrine qui affiche objets et actualités<br>
Un accès administrateur permet de créer des objets et des actualités



## Variables d'environnement:
> Créer un fichier .env dans le directory à la racine.<br>
> _DATABASE="DATA_BASE_NAME"
> _USER="root"
> _PASSWORD=""
> PORT="3000"
> _SECRET_KEY="CREATE_YOUR_SECRET_KEY"
> MAGIC_WORD="CREATE_YOUR_MAGIC_WORD"
> EMAIL_USER="EMAIL_USER"
> EMAIL_PASSWORD="EMAIL_PASSWORD"

### Installer node.js

### Ajouter variables d'environnement
configurer l'origin dans /back/app
configurer le host dans /front/src/app/host.js


### Installer les dépendances:

`npm install`

### Lancer le serveur:
`cd back`
`node server`

### Lancer l'application:
`cd front`
`npm run dev`

### Ou Lancer l'application côté server
`cd front`
`npm run build`
`node server`
