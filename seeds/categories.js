const seeder = require("mongoose-seed");
const faker = require("faker");

let items = [];
for (i = 0; i < 15; i++) {
  items.push({
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph()
  });
}

let data = [
  {
    model: "Category",
    documents: items
  }
];

// connect mongodb
seeder.connect(
  "mongodb://localhost/blog",
  function() {
    seeder.loadModels([
      "../models/categories" // load mongoose model
    ]);
    seeder.clearModels(["Category"], function() {
      seeder.populateModels(data, function() {
        seeder.disconnect();
      });
    });
  }
);
