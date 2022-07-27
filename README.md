# How to create an API with Node and MySQL

## Step-by-step to create your first project

1. Create new folder and open it in VSCode
2. Open the terminal and run `npm init --yes`. This will create a package.json
3. Next, run `npm i dotenv express cors mysql`. This will install the dotenv, express, cors and mysql packages
4. Create a `.gitignore` file with the following inside, to ignore pushing these files to github
   - `node_modules` => Ignore NPM packages from being uploaded
   - `.env` => Ignore .env which contains **environment variables**, which is usually sensitive information. add the following into this file
     - `DB_HOST` => Clevercloud Host
     - `DB_USER` => Clevercloud User
     - `DB_PASS` => Clevercloud Password
     - `DB_NAME` => Clevercloud Database Name
5. Create an `index.js` file. This file is the entry to your app.

   - Import express and cors

     ```JavaScript
     const express = require("express"); // Used to set up a server
     const cors = require("cors"); // Used to prevent errors when working locally
     ```

   - Configure the express server

     ```JavaScript
     const app = express(); // Initialize express as an app variable
     app.set("port", process.env.PORT || 6969); // Set the port
     app.use(express.json()); // Enable the server to handle JSON requests
     app.use(cors()); // Dont let local development give errors
     ```

   - Create '/' (home) route

     - This is where we check URLs and Request methods to create functionality
     - GET '/' is always what will be displayed on the home page of your application

     ```JavaScript
     app.get("/", (req, res) => {
         res.json({ msg: "Welcome" });
     });
     ```

   - Set up app listening for API calls

     ```JavaScript
     app.listen(app.get("port"), () => {
         console.log(`Listening for calls on port ${app.get("port")}`);
         console.log("Press Ctrl+C to exit server");
     });
     ```

6. Create 'lib' folder. 'lib' is short for library, where we can store our extra helpful functions that dont fit in anywhere else.

   - Create a db_connection.js file inside the lib folder. This will be used to create a single connection to the DB
   - Create the connection and insert the data from the .env file

     ```JavaScript
     const mysql = require("mysql");
     require("dotenv").config();

     // I put this here, so that I can use it across multiple files. Used to make SQL queries to DB
     var con = mysql.createConnection({
         host: process.env.DB_HOST,
         user: process.env.DB_USER,
         password: process.env.DB_PASS,
         database: process.env.DB_NAME,
         multipleStatements: true,
     });

     module.exports = con;
     ```

7. Create 'routes' folder. This is to contain and organize the code for our API calls, eg: '/users' or '/products'

   - Create a userRoute.js file inside the routes folder
   - Set up this file to be an express router (another way to think about this is sub-routes or routes inside of routes)
   - Import connection from db_connection.js
   - Create GET '/' method to fetch all users from DB

     ```SQL
     const express = require("express");
     const router = express.Router();
     const con = require("../lib/dbConnection");

     router.get("/", (req, res) => {
         try {
             con.query("SELECT * FROM users", (err, result) => {
                 if (err) throw err;
                 res.send(result);
             });
         } catch (error) {
             console.log(error);
             res.status(400).send(error)
         }
     });

     module.exports = router;
     ```

## DB Tables and API Routes

The following tables are the main tables:

- **users**
- **products**
- **categories**
- **orders**

You will will need to make a Route.js file for each. For each route, you will need to create the following API routes:

| Request Method | URL    | Effect                      |
| -------------- | ------ | --------------------------- |
| GET            | '/'    | Get all items               |
| GET            | '/:id' | Get single item             |
| POST           | '/'    | Create an item              |
| PUT            | '/:id' | Edit/update an item with ID |
| DELETE         | '/:id' | Delete an item with ID      |

## API Reference

### Users

#### Get all users

```http
  GET /users
```

#### Get single user by ID

```http
  GET /users/:id
```

| Parameter | Type  | Description                       |
| :-------- | :---- | :-------------------------------- |
| `id`      | `int` | **Required**. ID of item to fetch |

#### Register a new user

```http
  POST /users/
```

| Parameter                  | Type     | Description                                    |
| :------------------------- | :------- | :--------------------------------------------- |
| `email`                    | `string` | **Required**. email of user                    |
| `password`                 | `string` | **Required**. password of user                 |
| `full_name`                | `string` | **Required**. full name of user                |
| `billing_address`          | `string` | **Required**. billing address of user          |
| `default_shipping_address` | `string` | **Required**. default shipping address of user |
| `country`                  | `string` | **Required**. country of user                  |
| `phone`                    | `string` | **Required**. phone number of user             |

#### Log a user in

```http
  PATCH /users/
```

| Parameter  | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `email`    | `string` | **Required**. email of user    |
| `password` | `string` | **Required**. password of user |

#### Update/Edit a user

```http
  PUT /users/:id
```

| Parameter                  | Type     | Description                                    |
| :------------------------- | :------- | :--------------------------------------------- |
| `user_id`                  | `int`    | **Required**. ID of user                       |
| `email`                    | `string` | **Required**. email of user                    |
| `password`                 | `string` | **Required**. password of user                 |
| `full_name`                | `string` | **Required**. full name of user                |
| `billing_address`          | `string` | **Required**. billing address of user          |
| `default_shipping_address` | `string` | **Required**. default shipping address of user |
| `country`                  | `string` | **Required**. country of user                  |
| `phone`                    | `string` | **Required**. phone number of user             |

#### Delete a user

```http
  Delete /users/:id
```

| Parameter | Type  | Description              |
| :-------- | :---- | :----------------------- |
| `user_id` | `int` | **Required**. ID of user |

## How to host on Heroku

1. Create a new file called `Procfile`
   - Add `web: node index.js` to this file. This indicates to Heroku that this app is a Node.js application
2. In your `package.json` under the `"scripts"` object, add a new key-value pair
   `"start": "node index.js"`
   - Heroku will look for the start script to start running the Node.js application
3. Push work to github
4. Login/Register on Heroku
5. Create new app on Heroku Dashboard
   - Give the app a name
   - Under the "Deployment Method" section, connect the app to github
   - Select the repository you want to host
   - Make sure you select the correct branch to host
   - Enable `Automatic Deploys`, as this will update the API every time you push to Github
   - Click on the "Deploy Branch" button
   - Under the **Settings** tab, go to the "Config Vars" section and add in all the variables from your `.env` file.
   - Once all environment variables have been provided (correct spelling), click on the **More** button and select `Restart all dynos`. This will just refresh the application to make sure that the environment variables have been registered.

#### After following these steps, you should be able to open and use your hosted API! Congrats!

<!-- Middleware -->
<br>

## Creating Middleware

> Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next

### Dependinces needed to create the middleware

- jsonwebtoken / JWT
- config
  > `npm i jsonwebtoken config`

### What is jsonwebtoken

<a href="https://jwt.io/introduction">Click here for more</a>

> JWTs can be encrypted to also provide secrecy between parties, we will focus on signed tokens. Signed tokens can verify the integrity of the claims contained within it, while encrypted tokens hide those claims from other parties. When tokens are signed using public/private key pairs, the signature also certifies that only the party holding the private key is the one that signed it.

### What is config

<a href="https://www.npmjs.com/package/config">Click here for more</a>

> Node-config organizes hierarchical configurations for your app deployments.
> It lets you define a set of default parameters, and extend them for different deployment environments (development, qa, staging, production, etc.).

## Step-by-step to create your middleware

1. Create a new folder called `middleware`

   - create a file within `middleware` called `auth.js`

   ```JavaScript
     const jwt = require("jsonwebtoken");
     const config = require("config");

     module.exports = function (req, res, next) {
       //Get token from header
       const token = req.header("x-auth-token");

       //Check if not token
       if (!token) {
         return res.status(401).json({ msg: "No token, authorisation denied" });
       }

       try {
         const decoded = jwt.verify(token, config.get("jwtSecret"));

         req.user = decoded.user;
         next();
       } catch (err) {
         res.status(401).json({ msg: "Token is not valid" });
       }
     };
   ```

2. Add **_jwtSecret_** to your `.env` file

   - create a file within `config` called `default.json`

   ```Javascript
      DB_HOST=clever cloud host
      DB_USER=clever cloud user
      DB_PASS=clever cloud password
      DB_NAME=clever cloud database name
      DB_PORT=clever cloud port
      PORT=6969
      jwtSecret=Nobody_should_know_this
   ```

#### After following these steps, you should be able to import and attach your middleware to your routes! Congrats!
