module.exports = {
  db: {
    uri: "mongodb://localhost:27017/handy",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
};
