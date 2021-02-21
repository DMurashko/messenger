# messenger
A full-stack project using Socket.io, Node.js, Express.js, MongoDB, React.js and Redux

To start the project in the **development mode**:

1. cd server
2. npm install
3. cd app
4. npm install
5. cd ../
6. npm run dev

Make sure ports are configured correctly. For example, if you want client to run on the port 3000 and server on 3001, you should configure the following files:

***./server/config/default.json*** this one is for the development stage, set port to 3001 and baseUrl to your url + 3001

***./server/config/production.json*** this one is for the production stage, set port and baseUrl to the according values you need on production stage

***./server/package.json*** set proxy to the url you want server to be running on, for example: 

    "proxy": "http://localhost:3001"
    
***./server/app/package.json*** set proxy to the url you want client to redirect requests on, for example:

    "proxy": "http://localhost:3001"
    
***./server/app/src/config.json*** set the url on which websocket server is running, currently it coincides with the server url because they are running on the same url
