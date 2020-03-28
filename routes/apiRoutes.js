let db = require("../models");
let passport = require("../config/passport");

module.exports = function (app) {

  // API to get Stuff
  app.get("/api/stuff/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Stuff.findOne({
        where: [{id: id}],
        include: [db.Location, db.User, db.Category]
      }).then(function (dbStuff) {
        res.json(dbStuff);
      });
    } else {
      db.Stuff.findAll({
        include: [db.Location, db.User, db.Category]
      }).then(function (dbStuff) {
        res.json(dbStuff);
      });
    }
  });

  app.get("/api/user/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.User.findOne({
        where: [{id: id}]
      }).then(function (dbUser) {
        res.json(dbUser);
      });
    } else {
      db.User.findAll({}).then(function (dbUser) {
        res.json(dbUser);
      });
    }

  });

  app.get("/api/transaction/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Transaction.findOne({
        where: [{id: id}]
      }).then(function (dbTransaction) {
        res.json(dbTransaction);
      });
    } else {
      db.Transaction.findAll({}).then(function (dbTransaction) {
        res.json(dbTransaction);
      });
    }
  });

  app.get("/api/location/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Location.findOne({
        where: [{id: id}]
      }).then(function (dbLocation) {
        res.json(dbLocation);
      });
    } else {
      db.Location.findAll({}).then(function (dbLocation) {
        res.json(dbLocation);
      });
    }
  });

  app.get("/api/category/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Category.findOne({
        where: [{id: id}]
      }).then(function (dbCategory) {
        res.json(dbCategory);
      });
    } else {
      db.Category.findAll({}).then(function (dbCategory) {
        res.json(dbCategory);
      });
    }


  });

  // Create a new example
  app.post("/api/stuff", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });



  // Delete an example by id
  app.delete("/api/stuff/:id", function (req, res) {
    db.Example.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
