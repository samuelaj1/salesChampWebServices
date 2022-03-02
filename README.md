# sales-champ Postgres Db Webservices
Node.js application that exposes its API through REST service using postgres db and sequelize orm.

## Project on github
https://github.com/samuelaj1/salesChampWebServices

## Project documentation on postman
```
https://documenter.getpostman.com/view/8854544/UVksMuAx
```
## Local Project setup
```
locate the project directory
cd /salesChampWebServices
```

```
install node modules 
"npm i"
```

```
Serving the application
"node server.js" or "nodemon"
#NB: url for local server: http://localhost:3000
```
 
## Live Project url
```
Project was hosted on heroku
Base url: https://sales-champ-db.herokuapp.com
```
```
eg: Addresses endpoints

GET https://sales-champ-db.herokuapp.com/address - Returns all available addresses
POST https://sales-champ-db.herokuapp.com/address - Creates new address
GET https://sales-champ-db.herokuapp.com/address/{id} - Returns specific address
PATCH https://sales-champ-db.herokuapp.com/address/{id} - Modifies specific address
DELETE https://sales-champ-db.herokuapp.com/address/{id} - Permanently removes specific address

```



