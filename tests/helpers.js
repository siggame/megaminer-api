const api = require("../release/server").api;

before(async () => {
  // Start the server and wait for it to listen
  api.start("config-tests");
  return api.listening;
});

after((done) => {
  // Stop the server
  api.stop();
  done();
});

module.exports.server = "http://localhost:3000";

// Create a fresh environment
// Useful for common pre-suite actions
module.exports.makeSuite = (suiteName, tests) => {
  describe(suiteName, () => {
    before((done) => {
      // Any actions which are needed before running a test suite
      done();
    });

    tests();
  });
};
