
const express = require("express");
const formidableMiddleware = require('express-formidable');
const cors = require("cors");
require("dotenv").config()
global.fetch = require("node-fetch");
const app = express();
import routes from "@root/routes"
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
  swaggerDefinition:{
    openapi: '3.0.1',
    info:{
      title: "Wallet APIs",
      version: "1.0.0",
      description:
          'This is a REST API application made with Express.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./app/routes/api/v1/auth.js','./app/routes/crypto/v1/index.js'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)
var whitelist = ['http://localhost:3000','http://localhost:4000', 'http://10.10.11.78:3000', 'http://18.119.60.218']
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.use(formidableMiddleware());

//const db = require("./app/db/models");

//db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Welcome to exzocoin application. Ping test success." });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use("/", routes)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
