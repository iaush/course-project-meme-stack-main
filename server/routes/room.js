var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Session = require("../models/session");
var User = require("../models/user");
var Score = require("../models/score");

// Handle individual socket io connections
// This method attaches and handles the server-side websocket
// to the express app
function handleSocket(app) {
    const io = app.get('io');
    io.on('connection', function(socket) {
        console.log('user connected');
        socket.on('join', async function (param) {
            const {roomId, username} = JSON.parse(param);
            const session = await Session.findOne({_id: roomId});
            let questions = [];
            let tags = [];
            let scores = [];
            let submittedScores = [];
            if (!session) {
                console.log('creating new session:', roomId);
                let newSession = new Session({
                    createdBy: new User({username: 'mockFacultyUser', anonymous: true})
                })
                let result = await newSession.save();
                console.log(result);
                questions = [];
            } else {
                console.log("Room found");
                ({questions, tags} = await session.populate('questions tags').then(q => ({
                    tags: q.tags,
                    questions: q.questions
                })));
                console.log(username, roomId)
                if (username.includes(roomId)) {
                    // Anon user include roomId as part of 
                    // the backend username for ephemeral user purposes
                    console.log('anon user')
                    let user = await User.findOne({username});
                    if (user !== null) {
                        // sessionId = null as Scores can also be used for session level
                        // We only want the tag based scores here.
                        submittedScores = await Score.find({createdBy: user._id, sessionId: null});
                    };
                } else {
                    console.log('logged in user')
                    scores = await session.populate('scores').then(s => s.scores);
                }
            }
            socket.join(roomId);
            console.log(`user joined room: ${roomId}`);
            socket.compress(true).emit('populateQuestions', JSON.stringify(questions))
            socket.compress(true).emit('populateTags', JSON.stringify(tags));
            socket.compress(true).emit('populateScore', JSON.stringify(scores));
            if (submittedScores.length > 0) {
                socket.compress(true).emit('setSubmittedScore', JSON.stringify(submittedScores));
            }
            
        })

        socket.on("submitQuestion", async (questionObj) => {
            let { question, roomId, name } = JSON.parse(questionObj);
            console.log(question + " submitted");
            const session = await Session.findOne({ _id: roomId });
            if (!session) {
                console.log("Session not found!");
            }
            let newQuestion = new Question({
                sessionId: session._id,
                question,
                submitter: name,
            });
            try {
                const savedNewQuestion = await newQuestion.save();
                session.questions.push(savedNewQuestion._id);
                const result = await session.save();
                console.log("result of push", result);

                let questions = await Session.findOne({"_id" : roomId}).populate('questions')
                                .then(u => u.questions);
                const io = app.get('io');

                io.to(roomId.toString())
                    .emit('populateQuestions', JSON.stringify(questions));
            } catch (e) {
                socket.emit("error", "Unable to submit question");
            }
        });

        socket.on('answerQuestion', async (questionObj) => {
            let {questionId, answer, roomId} = JSON.parse(questionObj);
            let question = await Question.findOne({_id: questionId});
            if (! question) {
                return;
            }
            question.answer = answer;
            let success = await question.save();

            let questions = await Session.findOne({"_id" : roomId}).populate('questions')
                                .then(u => u.questions);
            const io = app.get('io');

            io.to(roomId.toString())
                .emit('populateQuestions', JSON.stringify(questions));
        })
        

        async function getUser(username) {
            let user = await User.findOne({username});
            if (user === null) {
                let newUser = new User({
                    username: username,
                    anonymous: true
                });
                user = await newUser.save();
            }
            return user
        }

        socket.on('submitTagRating', async (scoreObj) => {
            let {tagId, rating, roomId, username} = JSON.parse(scoreObj);
            console.log(username,  roomId)
            let user = await getUser(username);

            let session = await Session.findOne({ _id: roomId });
            if (session === null) {
                console.log("Session not found!");
                return;
            }
            console.log(user.toJSON())
            let score = await Score.findOne({
                tagId,
                createdBy: user._id.toString(),
            });
            if (score) {
                console.log("Score already submitted for this tag!");
                return;
            }
            let newScore = new Score({ tagId, score: rating, createdBy: user._id });
            score = await newScore.save();
            session.scores.push(score._id);
            let result = await session.save();
            let scores = await Score.find({ createdBy: user._id, tagId: {$ne: null} });
            socket.compress(true).emit(
                "submitTagScoreSuccess",
                JSON.stringify({
                success: true,
                data: scores.map((score) => ({
                    tagId: score.tagId.toString(),
                    score: score.score,
                    submittedBy: user._id,
                    })
                    ),
                })
            );
            let newTagScores = await result.populate('scores').then(s => s.scores);
            console.log(newTagScores);
            io.to(roomId).emit('populateScore', JSON.stringify(newTagScores));
        })

        socket.on('submitOverallRating', async (scoreObj) => {
            let {rating, roomId, username} = JSON.parse(scoreObj);
            let user = await getUser(username, roomId);

            let session = await Session.findOne({_id: roomId});
            if (session === null) {
                console.log("Session not found!");
                return
            }
            let score = await Score.findOne({sessionId: roomId, createdBy: user._id.toString()});
            if (score) {
                console.log('Score already submitted for this session!');
                return;
            }
            let newScore = new Score({sessionId: roomId, score: rating, createdBy: user._id});
            score = await newScore.save();
            session.overallScores.push(score._id);
            let sessionSave = await session.save()

            console.log('new overall submitted');
            // Send to room owner
            let scores = await Score.find({sessionId: roomId});
            io.to(roomId).emit('overallRatingSubmitted', JSON.stringify({
                success: true,
                data: scores.map(score => ({
                    score: score.score,
                    submittedBy: user._id
                }))
            }))
        })

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
  });

  return router;
}

module.exports = handleSocket;
