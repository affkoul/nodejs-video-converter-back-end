const express = require("express");
const path = require("path");
const app = express();
const expressFileUpload = require('express-fileupload');
const routes = require("./routes/convert");
const fs = require("fs");
const https = require("https");
const PORT = 5000;
const cors = require("cors");

app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

app.use(cors({
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
}));

// Configure body parsing for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add routes, both API and view
app.use(routes);

// Server static assets if we're in production
if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  // app.use(express.static(path.join(__dirname, "client/build")));
  app.use(express.static(path.join(__dirname, "../")));


  // Express serve up index.html file if it doesn't recognize route
  app.get("*", (req, res) => {
    // res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    res.sendFile(path.join(__dirname, "../", "index.html"));
  });
}

https
  .createServer(
    {
      key: fs.readFileSync(
        "/www/server/panel/vhost/cert/hlwsdtech.com/privkey.pem",
        "utf8"
      ),
      cert: fs.readFileSync(
        "/www/server/panel/vhost/cert/hlwsdtech.com/fullchain.pem",
        "utf8"
      ),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });

// Start the API server
// app.listen(PORT, () =>
//   console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
// );
