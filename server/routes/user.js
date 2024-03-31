var express = require('express');
var router = express.Router();
var User = require('../models/user');

/**
 * @swagger
 * /v1/user:
 *   get:
 *     summary: Get current user data
 *     description: Returns data relating to the current token holder
 *     security:
 *         - bearerAuth: []
 *     responses:
 *         '200':
 *             description: Successfully return user from users API
 *         '404':
 *             description: User not found
 *         '403':
 *             description: Not enough permissions to find user
 */
router.get('/', async (req, res, next) => {
  const user = await User.findOne({ username: res.locals.username });
  if (!user)
    return res.status(404).json({ status: 'error', message: 'User not found' });
  res.status(200).json({ status: 'success', data: user.toJSON() });
});

/**
 * @swagger
 * /v1/user/all:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     security:
 *         - bearerAuth: []
 *     responses:
 *         '200':
 *             description: Successfully return users from users API
 *         '404':
 *             description: User not found
 *         '403':
 *             description: Not enough permissions to find user
 */
router.get('/all', async (req, res, next) => {
  await User.find({})
    .then(function (users) {
      users = users.map((u) => u.toJSON());
      return res.status(200).json({ status: 'success', data: users });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

module.exports = router;
