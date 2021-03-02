# messenger

> A full-stack project using Socket.io, Node.js, Express.js, MongoDB, React.js and Redux

## Project setup

To start the project in the **development mode** from scratch just run it from the root of the repo: `npm run startup`

For further starts of the project consider using: `npm run dev`

## Make sure ports are configured correctly

For example, if you want client to run on the *port* `3000` and server on `3001`, you **should** configure the following files:

- `./config/default.json` -- this one is for the development stage, set *port* to 3001 and `baseUrl` to your *url* + `3001`

- `./config/production.json` -- this one is for the production stage, set *port* and `baseUrl` to the according values you need on production stage

- `./package.json` -- set proxy to the *url* you want server to be running on, for example:

```json
    "proxy": "http://localhost:3001"
```

- `./client/package.json` -- set proxy to the *url* you want client to redirect requests on, for example:

```json
    "proxy": "http://localhost:3001"
```

- `./client/src/config.json` -- set the *url* on which websocket server is running, currently it coincides with the server *url* because they are running on the same *url*.

## Project deployment

To start the project in the **production mode** run build script from the root of the repo: `npm run client:build`

When react production build is ready, start the server on *port* `80` by the command: `npm run start`

To start app remotely on **dedicated server** and run it *regardless* from the SSH-connection use `pm2 package` and command: `pm2 start npm start`

The project is successfully deployed and available by IP adress: `http://157.90.117.255/`