const bcrypt = require("bcrypt");
const seeder = require("mongoose-seed");
const faker = require("faker");

let items = [];
for (i = 0; i < 15; i++) {
  const salt = bcrypt.genSaltSync(10);
  const passwordGenerated = bcrypt.hashSync("123456", salt);
  items.push({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: passwordGenerated
  });
}

let data = [
  {
    model: "User",
    documents: items
  }
];

// connect mongodb
seeder.connect(
  "mongodb://localhost/blog",
  function() {
    seeder.loadModels([
      "../models/users" // load mongoose model
    ]);
    seeder.clearModels(["User"], function() {
      seeder.populateModels(data, function() {
        seeder.disconnect();
      });
    });
  }
);
