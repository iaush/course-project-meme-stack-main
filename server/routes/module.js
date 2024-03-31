var express = require('express');
var router = express.Router();

var Module = require('../models/module');
var User = require('../models/user');
var Session = require('../models/session');

/**
 * @swagger
 * /v1/module/add:
 *   post:
 *     summary: Create new module
 *     description: Creates a new module entry in db if doesn't exist
 *     security:
 *         - bearerAuth: []
 *     responses:
 *         '200':
 *             description: Successfully created
 *         '500':
 *             description: Unable to create entry
 */
router.post('/', async (req, res, next) => {
    const obj = { ...req.body };
    console.log(obj);
    const newMod = new Module(obj);
    const user = await User.findOne({ username: res.locals.username });
    const savedMod = await newMod.save();
    user.modules.push(savedMod._id);
    let addMod = await user.save();
    res.status(200).send({
        success: true,
        message: 'success',
    });
});
/**
 * @swagger
 * /v1/module/{moduleId}/week/{weekNo}/add:
 *   post:
 *     summary: New room / session data, e.g. module id,
 *     description: Fetch user modules
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *         - in: path
 *           name: moduleId
 *           schema:
 *               type: integer
 *           required: true
 *           description: Numeric ID of the module to add session id to
 *         - in: path
 *           name: weekNo
 *           schema:
 *               type: integer
 *           required: true
 *           description: Week number to add to
 *     responses:
 *         '200':
 *             description: Successfully fetched
 *         '500':
 *             description: Unable to process
 */
router.post('/:moduleId/week/:weekNo/add', async (req, res, next) => {
    const { moduleId, weekNo } = req.params;
    const user = await User.findOne({ username: res.locals.username });
    let newSession = new Session({
        createdBy: user,
    });
    newSession = await newSession.save();

    let module = Module.findOne({ id: moduleId });
    module = await module.populate('weeks');
    let weekData = module.weeks.get(weekNo);
    if (weekData === undefined) {
        module.weeks.set(weekNo, [newSession._id]);
    } else {
        weekData.push(newSession._id);
    }
    module = await module.save();
    res.status(200).send({
        success: true,
        message: 'Session ID added',
        data: newSession._id,
    });
});

/**
 * @swagger
 * /v1/module/user:
 *   get:
 *     summary: Get user modules
 *     description: Fetch user modules
 *     security:
 *         - bearerAuth: []
 *     responses:
 *         '200':
 *             description: Successfully fetched
 *         '500':
 *             description: Unable to process
 */
router.get('/user', async (req, res, next) => {
    let user = User.findOne({ username: res.locals.username });
    let modules = await user.populate('modules').then((u) => u.modules);
    res.status(200).send({
        success: true,
        message: 'Modules fetched',
        data: modules,
    });
});

/**
 * @swagger
 * /v1/module/user:
 *   post:
 *     summary: Get user modules
 *     description: Fetch user modules
 *     security:
 *         - bearerAuth: []
 *     responses:
 *         '200':
 *             description: Successfully fetched
 *         '500':
 *             description: Unable to process
 */
router.post('/user', async (req, res, next) => {
    let user = User.findOne({ username: res.locals.username });
    let modules = await user.populate('modules').then((u) => u.modules);
    res.status(200).send({
        success: true,
        message: 'Modules fetched',
        data: modules,
    });
});

/**
 * @swagger
 * /v1/{moduleId}/weeksData:
 *   post:
 *     summary: Get weekData for a moduleId
 *     description: Fetch weekData for a moduleId
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *         - in: path
 *           name: moduleId
 *           schema:
 *               type: integer
 *           required: true
 *           description: Numeric ID of the module to add session id to
 *     responses:
 *         '200':
 *             description: Successfully fetched
 *         '500':
 *             description: Unable to process
 */
router.post(`/:moduleId/weeksData`, async (req, res, next) => {
    const { moduleId } = req.params;
    let module = Module.findOne({ id: moduleId });
    module = await module.populate({
        path: 'weeks.$*', populate: [{
            path: 'tags',
            model: 'Tag'
        }, {
            path: 'scores',
            model: 'Score'
        }, {
            path: 'questions',
            model: 'Question'
        }, {
            path: 'overallScores',
            model: 'Score'
        }]
    });
    let weeks = module.weeks;
    res.status(200).send({
        success: true,
        message: 'Weeks Data fetched',
        data: weeks,
    });
});

module.exports = router;
