const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
// const  token = require("morgan");
const bcrypt=require("bcrypt");

// form Data model
//diskStorege gives you full controlll for uoloading files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    //const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let connectToMDB = async () => {
  try {
    await mongoose.connect(process.env.dbPath);

    console.log("Connected Successfully");
  } catch (err) {
    console.log("Something went wrong");
  }
};

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/upload", express.static("upload"));

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  profilePic: String,
});
let User = new mongoose.model("user", userSchema);

app.post("/validateLogin", upload.none(), async (req, res) => {
  console.log(req.body);

  let userDetails = await User.find().and({ email: req.body.email });

  if (userDetails.length == 0) {
    res.json({ status: "failure", msg: "user doesNot exist." });
  } else {

    let result=await bcrypt.compare(req.body.password,userDetails[0].password)
    console.log(result);
    // if (userDetails[0].password == req.body.password) 
    if(result== true){
      console.log(userDetails[0]);

      let encryptedCredentials = jwt.sign(
        { email: userDetails[0].email, password: userDetails[0].password },
        "Ravi"
      );
      console.log(encryptedCredentials);
      res.json({
        status: "Success",
        msg: "Valid Credentials",
        token: encryptedCredentials,
        data: userDetails[0],
      });
    } else {
      res.json({ status: "failure", msg: "incorrect password" });
    }
  }
  // console.log(userDetails);
  // res.json(userDetails);
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body.token);

  try {
    let decryptedCredential = jwt.verify(req.body.token, "Ravi");

    let userDetails = await User.find().and({
      email: decryptedCredential.email,
    });

    if (userDetails.length > 0) {
      if (userDetails[0].password == decryptedCredential.password) {
        res.json({
          status: "Success",
          msg: "Valid Credentials",

          data: userDetails[0],
        });
      } else {
        res.json({
          status: "failure",
          msg: "Invalid Token",
          data: userDetails[0],
        });
      }
    }
  } catch (err) {
    res.json({
      status: "failure",
      msg: "invalid token",
    });
  }

  // console.log(decryptedCredential);
  // res.json(["received token"]);
});

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  //express.json format
  console.log("We have received the request from client");
  console.log(req.file);
  console.log(req.body);

  let hashedPassword=await bcrypt.hash(req.body.password,10);
  console.log(req.body.password);
  console.log(hashedPassword);

  let userDetails = await User.find().and({ email: req.body.email });

  if (userDetails.length > 0) {
    res.json({ status: "failure", msg: "User already exist" });
  } else {
    try {
      let newUser = new User({
        firstName: req.body.fn,
        lastName: req.body.ln,
        email: req.body.email,
        // password: req.body.password,
        password: hashedPassword,
        profilePic: req.file.path,
      });

      await User.insertMany(newUser);

      res.json({ status: "Success", msg: "User Created Successfully" });
    } catch (err) {
      res.json({ status: "failure", msg: err });
    }
  }
});

app.patch("/updateDetails", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  await User.updateMany(
    { email: req.body.email },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      profilePic: req.file.path,
    }
  );
  res.json(["collected updated data"]);
});

app.delete("/deleteUser", upload.none(), async (req, res) => {
  try {
    let deletedUser = await User.deleteMany({ email: req.body.email });

    res.json({ status: "Success", msg: "Deleted user successfully" });
  } catch (err) {
    res.json(err);
  }
});

app.listen(process.env.port, () => {
  console.log("Listening to port 1234");
});
connectToMDB();
