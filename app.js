var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fs = require("fs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function createCSV() {
  const file = fs.readFileSync("./file.csv");
  const csvInJson = csvToJson(file);

  fs.writeFileSync(
    "./data.txt",
    JSON.stringify(csvInJson).replace(/},/g, "},\n\n")
  );
}

const csvToJson = (csv) => {
  const array = csv.toString().split("\r\n");
  const result = [];
  const headers = array[0].split(",");
  for (let i = 1; i < array.length - 1; i++) {
    const obj = {};
    const str = array[i];
    let s = "";

    let flag = 0;
    for (let ch of str) {
      if (ch === '"' && flag === 0) {
        flag = 1;
      } else if (ch === '"' && flag == 1) flag = 0;
      if (ch === "," && flag === 0) ch = "|";
      if (ch !== '"') s += ch;
    }

    const properties = s.split("|");
    for (let j in headers) {
      if (properties[j].includes(",")) {
        obj[headers[j]] = properties[j].split(", ").map((item) => item.trim());
      } else obj[headers[j]] = properties[j];
    }
    let code;
    if (i < 10) code = `00${i}`;
    else if (i < 100) code = `0${i}`;
    else code = i;
    obj.code = "ET-" + code;
    const splitValue = obj.Name.split("-");
    obj.Name = splitValue[0]?.trim();
    obj.contact = splitValue[1]?.trim();
    result.push(obj);
  }
  return result;
};

createCSV();

module.exports = csvToJson;
module.exports = app;
