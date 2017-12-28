// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by manage-items.js.
import { name as packageName } from "meteor/laurenth:manage-items";

// Write your tests here!
// Here is an example.
Tinytest.add('manage-items - example', function (test) {
  test.equal(packageName, "manage-items");
});
