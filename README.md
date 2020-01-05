# DOCUMENTACIÓ BEN A PROP

## BACKEND - Base de dades:

La base de dades està composta dels següents esquemes:
  - User: inclou les dades de l’usuari.
  - Post: inclou la informació de l’anunci.
  - Availability: inclou la informació del calendari de disponibilitat.
  - Message: inclou la informació dels missatges entre usuaris.
  - Appointment: inclou la informació de les cites (no està en ús actualment).

Els esquemes tenen els següents tipus de dades:
  * User:
    * _id: ObjectID
    * username: String
    * name: String
    * surname: String
    * email: String
    * image: String
    * password: String
    * postalCode: String
    * location: Object {
        type: String
        coordinates: [Number]
        place: String
        country_code: String
        state_code: String
        state: String
        province: String
        place: String
      }

  * Post:
    * _id: ObjectID
    * owner: Referència a User (_id).
    * title: String
    * description: String
    * range: Number
    * price: Number
    * services: Object {
        babysitter: Boolean
        classes: Boolean
        cleaner: Boolean
        pets: Boolean
      }
    * location: Object {
        type: String,
        coordinates: [Number]
      }

  * Availability:
    * _id: ObjectID
    * postId: Referència a Post (_id)
    * owner: Referència a User (_id)
    * calendar: ObjectID {
        fh1: [Boolean]
        fh2: [Boolean]
        fh3: [Boolean]
        fh4: [Boolean]
        fh5: [Boolean]
        fh6: [Boolean]
        fh7: [Boolean]
        fh8: [Boolean]
    }

  * Message:
    * _id: ObjectID
    * postId: Referència a Post (_id)
    * userId: Referència a User (_id)
    * text: String
    * title: String
    * status: Boolean

  * Appointment:
    * _id: ObjectID
    * owner: Referència a User (_id)
    * date: Date
    * userSubscribedId: Referència a User (_id)
    * discount: Boolean
  

## BACKEND - API:

La API que servirà les dades al Frontend te els següents endpoints, als quals es pot accedir amb diferents mètodes http:

/auth: Gestiona l’autenticació:
  * POST:
    * /auth/signup - paràmetres: totes les dades del model User
    * /auth/login  - paràmetres:  email i password
    * /auth/logout - paràmetres: token de sessió


/profile: Gestiona les peticions sobre perfils d’usuari:
  - GET:
    * /     - paràmetres: token (retorna el perfil de l’usuari logejat)
    * /:id  - paràmetre: id usuari, token (retorna el perfil de l’usuari corresponent a l’id passada per paràmetre)


/posts: Gestiona les peticions sobre anuncis:
  - POST: 
    * / - paràmetres: totes les dades del model Post, token
  
  - GET: 
    * /:userId      - paràmetres: id d’usuari, token (retorna els anuncis d’un usuari, utilitzat al perfil d’usuari)
    * /:postalCode  - paràmetres: codi postal, token (retorna tots els anuncis que arriben al codi postal passat per paràmetre)
  
  - DELETE:
    * /:id - paràmetres: id del post, token
  
  - PUT: 
    * /:id - paràmetres: tots els camps del model Post (només són obligatoris title i description) q


/availability: Gestiona les peticions sobre calendaris de disponibilitat:
  - POST: 
		* / -  paràmetres: tots els camps del model Availability, token

  - GET: 
		* /:postId - paràmetres: id del post, token

  - PUT:
		* /:postId - paràmetres: id del post, nou calendari, token


/messages: Gestiona les peticions sobre missatges:
  - POST: 
		* / - paràmetres: tots els camps del model Message, token

  - GET:
		* /:profileId - paràmetres: id d’usuari, token

  - PUT: 
		* /:id - paràmetres: id del missatge, nou status, token


Els endpoints citats estan protegits per una sèrie de middlewares:

  * auth: verificació de token de sessió.
  * fields: verificació de la informació provinent de camps de formularis.
  * postalCodes: verificació de què els codis postals siguin codis postals espanyols correctes.

Aquests, protegeixen les rutes. Si detecten algun tipus d'informació invàlida, retornen una resposta d'error amb l'status corresponent.

## Deploy en local

Per poder muntar l'app sobre el localhost, es necessita el següent programari:
* [Node.js](https://nodejs.org/), el qual instal·larà el seu gestor de paquets [Npm](https://www.npmjs.com/).
* [MongoDB](https://www.mongodb.com/) sobre el port 27017, per la persistència de dades.

```bash
$ git clone Repo_del_backend
$ cd Repo_del_backend
$ npm install
$ npm run dev
```
Primer de cop cal arrencar la base de dades.
Un cop arrencada i després de clonar el repositori i d'instal·lar els paquets requerits, cal arrencar l'aplicació.
Ja tenim el backend arrencat sobre el port 3000 (http://localhost:3000).
