# Todo-list

## About
  This is a simple CRUD of a todo-list project. However, i use the best software development practices, continuous integration and continuous delivery

## Technologies
* ### Language
   * Typescript

* ### Frontend
   * Next.js
   * React
   * React-dom

* ### Backend
  * Next.js

* ### Lint
  * Eslint
  * Prettier
  * EditorConfig
   
* ### Tests
  * Cypress

* ### Validation
  * Zod

* ### Database
  * Supabase

* ### CI/CD
  * Github Actions

* ### Deploy
  * Vercel

## Dependencies
```JSON
"dependencies": {
    "@supabase/supabase-js": "^2.24.0",
    "@types/node": "^20.1.1",
    "next": "^13.4.1",
    "node": "^20.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.21.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.6",
    "@types/uuid": "^9.0.1",
    "@typescript-eslint/eslint-plugin": "^5.56.0",
    "@typescript-eslint/parser": "^5.59.5",
    "cypress": "^12.14.0",
    "eslint": "^8.36.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-chai-friendly": "^0.7.2",
    "eslint-plugin-cypress": "^2.13.3",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-n": "^15.6.1",
    "eslint-plugin-no-only-tests": "^3.1.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-promise": "^6.1.1",
    "eslint-plugin-react": "^7.32.2",
    "prettier": "^2.8.7",
    "start-server-and-test": "^2.0.0",
    "typescript": "^5.0.4",
    "uuid": "^9.0.0"
  }
```

## Architecture
  This application has a simple architecture. Both backend and frontend are based on layers. These simple layers are based on input, processing and output. My layers are: View, controller and repository.

  * ### View:
      **Where application will get user input.** 
    
      In frontend it will be the user interface, where user can create, read, update and delete TODOs.

      In backend it will be where application receives user's input too, but there is no interface, in this case this "place" will be our http methods, where operations happens and we receive http requests (which uses json).
    
    In the project, these layers will be:
      * frontend: pages/index.ts - (until this moment this is the only User interface route)
      * backend: pages/api/ - everything inside this folder are api routes.

  * ### Controller:
     It **controlls the data flow on application**. it is responsible to receive data from input, forward to processing part and return the result of processing.

     In frontend the controller will be responsible to get data from user interface inputs, and forward to repository where the processing will be done, then return the output from repository.

     In Backend the controller will receive data from http request, forward to repository where the processing will be done and return the processing will be done, then return the output from repository.

  * ### Repository:
      Basically it is the **processing** layer. This one is responsible to processing data received by controller, access data, and return output.

      Front-end: Repository will receive the data from view through controller, then wil fetch data to api, and will return the response from APÌ.

      Backend: Respository will receive data from http request though controller, then will make a operation on database (in our application database is Supabase), then it will return the output from db.
    
    In a simple way: Data-flow is like this:
```
    **VIEW** <-------------> **CONTROLLER** <-------------> **REPOSITORY** <-----------> **DATA** 
     input                 (control data flow)             processing of received data
                                                           and access external data
    
                       
```
    
