var mongoose = require('mongoose');
var Module = require('./models/module');
var User = require('./models/user');
var Session = require('./models/session');
var Score = require('./models/score');
var Question = require('./models/question');
var Tag = require('./models/tag')
var bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const saltRounds = 10;

mongoose.connect(process.env.MONGODB_CONNSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/**
 * Creates a random list of anonymous users for a given sessionId
 * @param {String} sessionId 
 * @returns [User]
 */
async function createAnonymousUsers(sessionId) {
    let users = [];
    for (var i = 0; i <= faker.datatype.number(5); i++) {
        let user = new User({
            username: faker.internet.userName() + '-' + sessionId,
            anonymous: true
        })
        user = await user.save()
        users.push(user);
    }
    return users;
}

/**
 * Creates the admin user admin@nus with the password admin
 * @returns User
 */
async function initAdminUser() {
    let user = new User({ 
        username: 'admin@nus',
        hashed_password: await bcrypt.genSalt(saltRounds).then((salt) => {
            return bcrypt.hash('admin', salt);
        })
    });
    let adminUser = await user.save()
    return adminUser;
}

async function generateQuestions(users) {
    let questions = [];
    let randomRange = faker.datatype.number(5);
    for (var i = 0; i <= randomRange; i++) {
        let question = new Question({
            question: faker.lorem.sentence(),
            submitter: faker.helpers.arrayElement(users).username
        })

        if (faker.datatype.boolean()) {
            question.answer = faker.lorem.sentence()
        }
        let savedQuestion = await question.save();
        questions.push(savedQuestion);
    }
    return questions;
}

async function generateOverallScores(sessionId, users) {
    let scores = [];
    let subsetUsers = faker.helpers.arrayElements(users);
    for (const user of subsetUsers) {
        let score = new Score({
            sessionId,
            createdBy: user._id,
            score: faker.datatype.number({min: 1, max: 5})
        })
        let newScore = await score.save()
        scores.push(newScore);
    }
    return scores;
}

async function generateTags(sessionId) {
    let tags = [];
    let possibleTags = ['React', 'Express', 'Javascript', 'Networking', 'Modularization', 'GraphQL', 
    'HTML', 'CSS']
    let tagSelection = faker.helpers.arrayElements(possibleTags);
    for (const tag of tagSelection) {
        let newTag = new Tag({
            name: tag,
            sessionId
        })
        newTag = await newTag.save();
        tags.push(newTag);
    }
    return tags;
}

async function generateTagScores(tags, users) {
    let scores = [];
    let subsetUsers = faker.helpers.arrayElements(users);
    for (const user of subsetUsers) {
        let subsetTags = faker.helpers.arrayElements(tags);
        for (const tag of subsetTags) {
            let newScore = new Score({
                createdBy: user._id,
                score: faker.datatype.number({min: 1, max: 5}),
                tagId: tag._id 
            })
            newScore = await newScore.save();
            scores.push(newScore);
        }
    }
    return scores;
}

async function generateMockSession(adminUser) {
    let newSession = new Session({
        createdBy: adminUser,
    });

    newSession = await newSession.save();

    let anonUsers = await createAnonymousUsers(newSession._id);
    let questions = await generateQuestions(anonUsers);
    newSession.questions = questions.map(question => question._id);

    let overallScores = await generateOverallScores(newSession._id, anonUsers);
    newSession.overallScores = overallScores.map(score => score._id);
    
    let tags = await generateTags(newSession._id);
    newSession.tags = tags.map(tag => tag._id);

    let tagScores = await generateTagScores(tags, anonUsers);
    newSession.scores = tagScores.map(score => score._id);

    newSession = await newSession.save();
    return newSession;
}

async function initModule() {
    let module = new Module({
    semester: 2,
    acadYear: "2022/2023",
    title: "Software Engineering on Application Architecture",
    description: "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught.",
    department: "Computer Science",
    moduleCode: "IT5007",
    weeks: {
        "0": [],
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "9": [],
        "10": [],
        "11": [],
        "12": []
    }
    });
    module = await module.save();
    return module
}

function runInit() {
    return new Promise(async function (resolve) {
        let user = await User.findOne({username: 'admin@nus'});
        if (user !== null) {
            return resolve(true);
        }
        let adminUser = await initAdminUser();
        let module = await initModule();
        adminUser.modules.push(module._id);
        await adminUser.save()

        for (const [weekId, week] of module.weeks) {
            let randomSessions = faker.datatype.number({min:1, max: 3});
            for (var i = 0; i <= randomSessions; i++) {
                let session = await generateMockSession(adminUser);
                console.log(session, weekId, module.weeks);
                week.push(session._id);
            }
        }
        module = await module.save();
        return resolve(true);
    })
}

runInit().then(() => {
    console.log('complete init');
    process.exit(0);
});
