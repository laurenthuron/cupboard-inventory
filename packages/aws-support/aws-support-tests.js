// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by aws-support.js.
import { name as packageName } from "meteor/laurenth:aws-support";

// Write your tests here!
// Here is an example.
Tinytest.add('aws-support - example', function (test) {
  test.equal(packageName, "aws-support");
});
