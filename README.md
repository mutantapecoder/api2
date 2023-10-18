# NodeJS & Express API (API2) 

- Express and NodeJS based API with authenticated user custom middleware to protect private routes.

- One endpoint - /profiles
- 
- has the same features as boilerplate API1 (user authenticated routes and sign up and login for user) but also a complete endpoint with restful routes at /api/profiles/

- A logged in user can create a profile, which will be visible to all users of the site to view (authenticated or not, on the GET /api/profiles route.

- Each profile belongs to a user ID (has to be a user in mongoDB). The profile owner can edit or delete their profile.

- fully functional user authentication using jwt, with logged in users being the only ones who can access certain routes (like creating, editing and deleting profiles).

### Authorisation Flow:

- jwt tokens are used for authorisation flow
- upon signup or login a jwt token is generated/retrieved(if token not expired) by using the sign method in jwt.
- this will return a token which can be accessed from the request header x-auth-token.
- use middleware to create a function which can verifies if the request header contains a token, and if so, if it is valid and can be verified, using the token and the secret. if yes, then can continue to access the route the middleware is implemented on, otherwise you will not be able to access the route, and instead receive a server error message.

### Modifications to make for another boilerplate version:

- add different types of login - oAuth with google, github etc. this will require tweaking the middleware function as well as the register and login functions where the jwt is created.
- add some extra controller logic
- seed data from a dummy data API on each connection to server.

### Setup

#### create a default.json file

- in the config folder to store the secret tokens for Mongo and JWT. store as a json object as follows

```
{
    "mongoURI":"<enter here>",
    "jwtSecret": "<enter here>"
}

```

#### run following command in terminal to run.

```bash
npm i && nodemon
```