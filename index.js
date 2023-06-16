const path = require("path");

const glob = require("glob");
const fs = require("fs-extra");

const { generatesummaryMd } = require("./fileHelper");

const pattern = "output/**/!(*original).json";
const files = glob.sync(pattern);

const allClouds = {};
for (let file of files) {
  let fileName = path.basename(file, ".json");
  allClouds[fileName] = fs.readJSONSync(file);
}

generatesummaryMd("summary.md", allClouds);

fs.outputJsonSync("cloud_data.json", allClouds);
