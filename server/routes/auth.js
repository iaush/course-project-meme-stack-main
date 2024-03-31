const path = require('path');
var express = require('express');
const jwt = require('jsonwebtoken');
var User = require('../models/user');
var bcrypt = require('bcryptjs');

const saltRounds = 10;

var router = express.Router();

/**
 * @swagger
 * /v1/auth:
 *   post:
 *     summary: Authentication endpoint
 *     description:
 *         Returns JWT token for use with headers.
 *         Requires username / password body
 *     requestBody:
 *         required: true
 *         content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *     responses:
 *         '200':
 *             description: Successfully received data
 *         '404':
 *             description: User not found
 *         '403':
 *             description: Not enough permissions to find user
 */
router.post('/', async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username }, 'hashed_password').exec();
  if (user) {
    const cmp = await user.validateUser(req.body.password);
    if (!cmp)
      return res
        .status(400)
        .json({ status: 'error', message: 'Unable to validate password' });
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Credentials invalid. Please check credentials are correct',
    });
  }
  var token = jwt.sign(
    { username: req.body.username },
    process.env.SECRET_KEY,
    {
      expiresIn: 1000 * 60 * 60 * 24, // would expire after 24 hours
    }
  );

  return res.status(200).json({
    expiresIn: 1000 * 60 * 60 * 24,
    token,
  });
});

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Registration endpoint
 *     description: Requires username / password body
 *     requestBody:
 *         required: true
 *         content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *     responses:
 *         '200':
 *             description: Successfully received data
 *         '400':
 *             description: Please provide a username and password
 *         '409':
 *             description: Username already taken
 *         '500':
 *             description: Error registering
 */
router.post('/register', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a username and password',
    });
  }
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return res
      .status(409)
      .json({ status: 'error', message: 'Username already taken' });
  }
  try {
    const user = new User({
      username: req.body.username,
      hashed_password: await bcrypt.genSalt(saltRounds).then((salt) => {
        return bcrypt.hash(req.body.password, salt);
      }),
    });
    const result = await user.save();
    return res
      .status(200)
      .json({ status: 'success', message: 'User created!' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
