const express = require("express");
const dashboard = express();
const path = require("path");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const { config } = require("dotenv");

config({
    path: "../private/.env"
});

module.exports = client => {
  // root/dashboard/
  const dashboardDirectory = path.resolve(
    `${process.cwd()}${path.sep}dashboard`
  );
  // root/dashboard/templates
  const templatesDirectory = path.resolve(`${dashboardDirectory}${path.sep}templates`);
  // root/dashboard/public
  dashboard.use(
    "/public",
    express.static(path.resolve(`${dashboardDirectory}${path.sep}public`))
  );

  passport.use(
    new Strategy(
      {
        clientID: (process.env.clientID),
        clientSecret: (process.env.oauthSecret),
        callbackURL: (process.env.callbackUrl),
        scope: ["identity", "guilds"]
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );

  dashboard.use(
    session({
      store: new MemoryStore({ checkPeriod: 99999999 }),
      secret: (process.env.sSecret),
      resave: false,
      saveUninitialized: false
    })
  );

  dashboard.use(passport.initialize());
  dashboard.use(passport.session());

  dashboard.engine("html", require("ejs").renderFile);
  dashboard.set("view engine", "html");

  const renderTemplate = (res, req, template, data = {}) => {
      const baseData = {
          bot: client,
          path: req.path,
          user: req.isAuthenticated() ? req.user : null
      };
      res.render(
          path.resolve(`${templatesDirectory}${path.sep}${template}`),
          Object.assign(baseData, data)
      );
  };

  dashboard.get("/", (req, res) => {
      renderTemplate(res, req, "home.ejs");
  });

  dashboard.listen((process.env.port));
};