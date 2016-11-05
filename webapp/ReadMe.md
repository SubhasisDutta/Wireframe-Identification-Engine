
# About
This Application is a Web Container to provide a DEMO of the Concept of identification of different
User Interface Components in a User designed wireframe. The User provides the design by uploading a
hand drawn or computer designed Image Page (Currently Support .jped and Png).

# Web App Installation
This Steps can be run after all the dependency of the application have been resolved.
As per the steps in Root ReadMe.md file.

## Setup

From inside the webapp folder run:
```
$ npm install.
$ bower install
```

### During Development

Build vendor.js and bundle.js

```
$ gulp build-client
```

Start the watch
```
$ gulp watch
```

Run Server using nodemon
```
$ nodemon server.js
```

### In Production
Set NODE_ENV to production

Build vendor.js and bundle.js
```
$ gulp build-client
```

Run Server using node or forever
```
$ node server.js
```
