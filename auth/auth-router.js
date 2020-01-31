const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const UserModel = require("../users/user-model");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.add({
      username,
      password: hashedPassword
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await UserModel.findBy({ username }).first();
    const validPassword = await bcrypt.compare(password, user.password);
    if (user && validPassword) {
      const token = signToken(user);
      res
        .header("authorization", token)
        .status(200)
        .json({
          token,
          message: `Welcome ${user.username}!`
        });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

function signToken(user) {
  const payload = {
    username: user.username
  };

  const secret = process.env.JWT_SECRET || "shhh secret";

  const options = {
    expiresIn: "1h"
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
