const db = require("../db");
const shortid = require("shortid");

const bcrypt = require("bcrypt");

module.exports.index = (req, res) =>
  res.render("users/index", {
    users: db.get("users").value(),
  });

  
module.exports.search = (req, res) => {
  var q = req.query.q;
  var matchUsers = db
    .get("users")
    .value()
    .filter(function (user) {
      return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
  res.render("users/index", {
    users: matchUsers,
  });
};


module.exports.create = (req, res) => {
  // Test cookie
  console.log(req.cookies);

  res.render("users/create");
};
module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.avatar = req.file.path.split('\\').slice(1).join('\\');

  var saltRounds = 10;
  req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
  req.body.wrongLoginCount = 0;

  db.get("users").push(req.body).write();
  res.redirect("/users");
};


module.exports.edit = (req, res) => {
  var id = req.params.id;
  var user = db.get("users").find({ id: id }).value();
  res.render("users/edit", {
    user: user,
  });
};
module.exports.postEdit = (req, res) => {
  db.get("users")
    .find({ id: req.body.id })
    .assign({ name: req.body.name, phone: req.body.phone })
    .write();
  res.redirect("/users");
};


module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get("users").remove({ id: id }).write();
  res.redirect("/users");
};
