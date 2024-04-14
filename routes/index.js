var express = require("express");
var router = express.Router();
const fs = require("fs");
const swal = require("sweetalert");
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
  console.log(user);
  if (user) return res.render("index", user);
  else return res.render("index", { error: "Not found" });
});

module.exports = router;
