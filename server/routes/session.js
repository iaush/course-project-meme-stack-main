var express = require('express');
var router = express.Router();
var Tag = require('../models/tag');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/tag/add', async (req, res, next) => {
    console.log(res.locals.username)
    const {tagName, sessionId} = req.body;
    let user = await User.findOne({username: res.locals.username});
    let tag = await Tag.findOne({name: tagName, sessionId});
    if (tag === null) {
        tag = new Tag({createdBy:user._id, name:tagName, sessionId});
        tag.save();
    }

    let session = await Session.findOne({_id: sessionId});
    session.tags.push(tag._id.toString());
    session = await session.save();
    const io = req.app.get('io');
    io.to(sessionId).emit('addTag', JSON.stringify([tag]));
    res.status(200).send({
        success: true,
        message: 'success'
    });
})

router.get('/tags', async (req, res, next) => {
    let tags = await Tag.find();
    res.status(200).json({status: true, data: tags, message: 'success'})
})

module.exports = router;