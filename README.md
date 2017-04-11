# vue-django-channels

> Django Channels WebSocketBridge handler for Vue.js

Based on a socket.io implementation - [icebob/vue-websocket](https://github.com/icebob/vue-websocket)

Scaffold generated with [vue-cli](https://github.com/vuejs/vue-cli) [webpack-simple](https://github.com/vuejs-templates/webpack-simple) template.

I develop on Windows 10 so I do pretty much all of my development using Docker.

## Setup

##### ports
This project uses 8181 for the dev-server port. I did this because the default 8080 confilcts with my primary dev 
configuration and just remapping in the compose file does not work because of CORS. 

To change the port, these files need updated with the port of your choosing:

`package.json`
```json
"dev": "cross-env NODE_ENV=development webpack-dev-server --hot --host 0.0.0.0 --port 8181",
```
`docker-compose.yml`
```yaml
  ports:
      - "8181:8181"
```

##### build docker images
```commandline
docker-compose build
```
##### install node dependencies
> see Dockerfile for why this is done here
```commandline
docker-compose run yarn
```
For some reason yarn and npm fail to install node-sass properly resulting in this error 
`ENOENT: no such file or directory, scandir '/code/node_modules/node-sass/vendor'`. 
This may be something with my current config so if you may not get this error. 

To fix this, run bash in a yarn container and run the `install.js` script:
```bash
vue-django-channels> docker-compose run yarn bash
root@1071df0c4c5f:/code# node node_modules/node-sass/scripts/install.js
Downloading binary from https://github.com/sass/node-sass/releases/download/v4.5.2/linux-x64-48_binding.node
Download complete
Binary saved to /code/node_modules/node-sass/vendor/linux-x64-48/binding.node
```

## Build Setup

``` bash
# install dependencies
docker-compose run yarn

# serve with hot reload at localhost:8181
docker-compose up [-d]

# build for production with minification
docker-compose run yarn yarn build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
