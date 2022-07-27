const express = require("express");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");
const router = express.Router();
const con = require("../lib/dbConnection");
const bcrypt = require("bcryptjs");

router.get("/", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete User
router.delete("/users/:id", (req, res) => {
  try {
    let sql = "DELETE FROM users WHERE ?";
    let user = {
      user_id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("User successfully removed");
    });
  } catch (error) {
    console.log(error);
  }
});

// Register
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    let user = {
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
      user_type: req.body.user_type,
      phone: req.body.phone,
      country: req.body.country,
      billing_address: req.body.billing_address,
      default_shipping_address: req.body.default_shipping_address,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        console.log(isMatch);
        // New code
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              full_name: result[0].full_name,
              email: result[0].email,
              user_type: result[0].user_type,
              phone: result[0].phone,
              country: result[0].country,
              billing_address: result[0].billing_address,
              default_shipping_address: result[0].default_shipping_address,
            },
          };
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
        // Old Code
        // if (result[0].password !== req.body.password) {
        //   console.log("Password doesnt match");
        // } else {
        //   const payload = {
        //     user: {
        //       user_id: result[0].user_id,
        //       full_name: result[0].full_name,
        //       email: result[0].email,
        //       user_type: result[0].user_type,
        //       phone: result[0].phone,
        //       country: result[0].country,
        //       billing_address: result[0].billing_address,
        //       default_shipping_address: result[0].default_shipping_address,
        //     },
        //   };
        //   jwt.sign(
        //     payload,
        //     process.env.jwtSecret,
        //     {
        //       expiresIn: "365d",
        //     },
        //     (err, token) => {
        //       if (err) throw err;
        //       res.json({ token });
        //     }
        //   );
        // }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Verify
router.get("/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

// Update user
router.put("/update-user", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      user_id: req.user.user_id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE user_id = ${req.user.user_id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          full_name: req.body.full_name,
          email: req.body.email,
          password: hash,
          user_type: req.body.user_type,
          phone: req.body.phone,
          country: req.body.country,
          billing_address: req.body.billing_address,
          default_shipping_address: req.body.default_shipping_address,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.send("Successfully Updated");
        });
      } else {
        res.send("User not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
