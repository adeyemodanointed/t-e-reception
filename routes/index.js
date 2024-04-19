var express = require("express");
var router = express.Router();
const fs = require("fs");
const swal = require("sweetalert");
const usedCodes = [];
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { base: "Express" });
});

router.post("/submit", async (req, res) => {
  const { seat_number } = req.body;
  const nameFile = fs.readFileSync("./data.txt");
  let fileInJson = nameFile.toString().replace(/},\n/g, "},");
  fileInJson = JSON.parse(fileInJson);

  const user = fileInJson.find((el) => el.code === `ET-${seat_number}`);
  if (user) {
    if(usedCodes[seat_number])
      return res.render("index", {error: "Oops... User Code used already..."})
    usedCodes[seat_number] = true;
    return res.render("index", user);
  } else return res.render("index", { error: "Oops! Code does not exist." });
});

module.exports = router;
