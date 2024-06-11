const mongoose = require("mongoose");
const { Code } = require("./Code");
const { Python } = require("./Python");

(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/compiler`);
})();

module.exports = {
    Code,
    Python
}