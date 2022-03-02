# sales-champ-WebServices
Node.js application that exposes its API through REST service.

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
install node modules - npm i
```

```
Serving the application
run - node server.js or nodemon
#NB: url for local server: http://localhost:8081
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



