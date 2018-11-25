const slugify = require("slugify");
const seeder = require("mongoose-seed");
const faker = require("faker");
const { Category } = require("../models/categories");
const { User } = require("../models/users");
const mongoose = require("mongoose");
const _ = require("lodash");
mongoose
  .connect(
    "mongodb://localhost/blog",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to database for seed"))
  .catch(err => console.error("Could not connect to database"));

const doSeed = async () => {
  const categories = await Category.find();
  const getRandom = _.sample(categories);

  const fakeUsers = await User.find();
  const getRandomUsers = _.sample(fakeUsers);
  // Seed comments

  let fakeComments = [];

  for (i = 0; i < 10; i++) {
    fakeComments.push({
      user: {
        _id: getRandomUsers._id,
        name: getRandomUsers.name,
        email: getRandomUsers.email
      },
      subject: faker.lorem.sentence(),
      content: faker.lorem.sentences()
    });
  }

  let items = [];
  for (i = 0; i < 10; i++) {
    const fakeTitle = faker.lorem.sentence();
    items.push({
      title: fakeTitle,
      slug: slugify(fakeTitle),
      image: faker.image.technics(745, 255),
      content: faker.lorem.paragraphs(),
      views: Math.floor(Math.random() * 1000 + 1),
      tags: new Array(5)
        .fill(null)
        .map(e => (e = faker.fake("{{lorem.word}}"))),
      category: {
        _id: getRandom._id,
        title: getRandom.title
      },
      comments: fakeComments
    });
  }

  let data = [
    {
      model: "Post",
      documents: items
    }
  ];

  // connect mongodb
  seeder.connect(
    "mongodb://localhost/blog",
    function() {
      seeder.loadModels([
        "../models/posts" // load mongoose model
      ]);
      seeder.clearModels(["Post"], function() {
        seeder.populateModels(data, function() {
          seeder.disconnect();
        });
      });
    }
  );
};

doSeed();
