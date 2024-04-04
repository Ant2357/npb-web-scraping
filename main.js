const fs = require("fs");
const npb = require("./npb/webScraping");

const jsonOutput = (url, data) => {
  fs.writeFile(url, JSON.stringify(data, null, "  "), err => {
    if (err) {
      throw err
    }
  });
};

const jsonPath = "./output";
(async () => {
  try {
    jsonOutput([jsonPath, "/CL.json"].join(""), await npb.standings("CL"));
    jsonOutput([jsonPath, "/PL.json"].join(""), await npb.standings("PL"));
    jsonOutput([jsonPath, "/CP.json"].join(""), await npb.standings("CP"));
    jsonOutput([jsonPath, "/OP.json"].join(""), await npb.standings("OP"));
  } catch (error) {
    console.error(error);
  }
})();
