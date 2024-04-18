const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// ----------------------- Get requests -------------------------------------

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/find-pets", (req, res) => {
  res.render("findPet");
});

app.get("/dog-care", (req, res) => {
  res.render("dogCare");
});

app.get("/cat-care", (req, res) => {
  res.render("catCare");
});

app.get("/give-away", (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.redirect("/login");
  }

  res.render("giveAway", { username });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/disclaimer", (req, res) => {
  res.render("disclaimer");
});

app.get("/create-account", (req, res) => {
  res.render("createAccount");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error logging out. Please try again.");
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    }
  });
});

// ----------------------- Post requests --------------------------------

app.post("/createAccount", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Regular expressions for username and password validation
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;

  if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
    return res.render('failedAccount');
  }

  // Check if the username already exists
  const loginFilePath = path.join(__dirname, "data", "login.txt");
  const data = fs.readFileSync(loginFilePath, "utf8");
  const lines = data.split("\n");
  for (const line of lines) {
    const [existingUsername] = line.split(":");
    if (existingUsername === username) {
      return res.render('failedAccount');
    }
  }

  // If username is unique, write to login file
  const newData = `${username}:${password}\n`;
  fs.appendFileSync(loginFilePath, newData);

  res.render("successAccount");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const filePath = path.join(__dirname, "data", "login.txt");
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n");
  let loggedIn = false;

  for (const line of lines) {
    const [storedUsername, storedPassword] = line.split(":");
    if (storedUsername === username && storedPassword === password) {
      loggedIn = true;
      break;
    }
  }

  if (loggedIn) {
    req.session.username = username;
    res.redirect("/give-away");
  } else {
    return res.render('failedLogin');
  }
});

app.post("/give-away", (req, res) => {
  const animal = req.body.animal;
  const breed = req.body.breed;
  const gender = req.body.gender;
  const age = req.body.ageCategory;
  const type = req.body.type;
  const brag = req.body.brag;
  const fullName = req.body.fname;
  const email = req.body.email;

  const petID = uuidv4();

  const petEntry = `${petID}:${animal}:${breed}:${gender}:${age}:${type}:${brag}:${fullName}:${email}\r\n`;

  const filePath = path.join(__dirname, "data", "pet_info.txt");
  fs.appendFileSync(filePath, petEntry);

  res.render("successForm");
});

app.post("/find-pets", (req, res) => {
  const breed = req.body.breed;
  const gender = req.body.gender;
  const age = req.body.ageCategory;
  const type = req.body.type;

  const petRecords = getPetInfo().filter((pet) => {
    return (
      (breed === "Any" || breed === pet.breed) &&
      (gender === "Any" || gender === pet.gender) &&
      (age === "Any" || age === pet.age) &&
      (type === "Any" || type === pet.type)
    );
  });
  res.render("petResults", { petRecords });
});

function getPetInfo() {
  const petInfoFilePath = path.join(__dirname, "data", "pet_info.txt");
  const data = fs.readFileSync(petInfoFilePath, "utf8");
  const lines = data.split("\n");
  const petRecords = lines.map((line) => {
    const [id, animal, breed, gender, age, type, brag, fullName, email] =
      line.split(":");
    return { id, animal, breed, gender, age, type, brag, fullName, email };
  });

  return petRecords;
}

// -------------------------- Server location -------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
