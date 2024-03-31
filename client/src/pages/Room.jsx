import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import QuestionsContainer from '../components/QuestionsContainer';
import TagsContainer from '../components/TagsContainer';
import useUserStore from '../stores/userStore';
import QRCode from './QRCode';
import './Room.css';
import RatingContainer from '../components/RatingContainer';
import Swal from 'sweetalert2';
import { Container, Button } from 'react-bootstrap';
import '../components/Common/Button.css';
import { useNavigate } from 'react-router-dom';

var socket;

// Room component for session
function Room() {
  const navigate = useNavigate();
  const [loggedIn, setIsLoggedIn] = useState(false);
  const {
    checkLoggedIn,
    getClient,
    username,
    setAnonymousUsername,
    getAndSetUser,
    anonymous,
    setSubmittedScores,
  } = useUserStore((store) => ({
    checkLoggedIn: store.checkLoggedIn,
    getClient: store.getClient,
    username: store.username,
    setAnonymousUsername: store.setAnonymousUsername,
    getAndSetUser: store.getAndSetUser,
    anonymous: store.anonymous,
    setSubmittedScores: store.setSubmittedScores,
  }));
  let { roomId } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [submitRating, setSubmitRating] = useState(false);
  const [rating, setRating] = useState(2);
  const [name, setName] = useState('User');
  const [score, setScore] = useState([]);

  useEffect(() => {
    if (checkLoggedIn() === true) {
      setIsLoggedIn(true);
      getAndSetUser();
      return;
    }
    if (username) {
      setName(username);
      setAnonymousUsername(username);
      return;
    }
    Swal.fire({
      title: 'Username',
      text: 'Enter a username:',
      input: 'text',
      inputAttributes: {
        input: 'text',
        required: 'true',
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        setName(result.value);
        setAnonymousUsername(result.value);
      }
    });
  }, []);

  useEffect(() => {
    if (!username) return;
    socket = io();
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit(
        'join',
        JSON.stringify({
          roomId,
          username: anonymous ? username + '-' + roomId : username,
        })
      );
      console.log('Emitted join');
    });

    socket.on('populateQuestions', function (questions) {
      setQuestions(JSON.parse(questions));
    });

    socket.on('addTag', function (tag) {
      setTags((state) => [...state, JSON.parse(tag)[0]]);
    });

    socket.on('populateTags', function (tags) {
      setTags(JSON.parse(tags));
      if (anonymous === false) {
        console.log('all tags', tags);
      }
    });

    socket.on('populateScore', function (scores) {
      scores = JSON.parse(scores);
      if (anonymous === false) {
        console.log('All scores', scores);
        setScore(scores);
      }
    });

    socket.on('setSubmittedScore', function (scores) {
      scores = JSON.parse(scores);
      setSubmittedScores(scores);
    });

    if (!anonymous) {
      socket.on('overallRatingSubmitted', (response) => {
        console.log(JSON.parse(response));
      });
    }

    return () => {
      socket.off('connect');
      socket.off('populateQuestions');
      socket.off('disconnect');
      socket.off('submitTagScoreSuccess');
      socket = undefined;
    };
  }, [username]);

  const handleSubmitQuestion = (question) => {
    socket.emit('submitQuestion', JSON.stringify({ question, roomId, name }));
  };

  const handleAnswerQuestion = (questionId, answer) => {
    socket.emit(
      'answerQuestion',
      JSON.stringify({ questionId, answer, roomId })
    );
  };

  /**
   * Post request to backend for authenticated user to add tags to current
   * session
   * @param {String} tagName
   */
  const addTag = async (tagName) => {
    let client = getClient();
    let result = await client.post('/api/v1/session/tag/add', {
      tagName,
      sessionId: roomId,
    });
  };

  const handleSubmitOverallRating = () => {
    socket.emit(
      'submitOverallRating',
      JSON.stringify({
        rating,
        roomId,
        username: anonymous ? username + '-' + roomId : username,
      })
    );
    setSubmitRating(true);
  };

  const footerStyles = {
    marginBottom: submitRating ? '0px' : '200px',
    height: submitRating ? '0px' : '180px',
  };

  return (
    <Container fluid className='p-0 m-0 room-container'>
      <Container fluid style={{ marginBottom: footerStyles.marginBottom }}>
        <QRCode
          url={window.location.href}
          showQRCode={showQRCode}
          setShowQRCode={setShowQRCode}
        />
        <Container
          fluid
          className='d-flex flex-column align-items-center justify-content-center px-4'
        >
          <Button
            className='custom-button large-button dark-blue-button btn'
            onClick={() => setShowQRCode(true)}
          >
            Show QR Code
          </Button>
          <Button
            className='custom-button large-button blue-button btn btn-light'
            onClick={() => navigate('/')}
          >
            Exit Session
          </Button>
        </Container>
        <Container className='my-3 mx-4'>
          <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
          <p>Username: {username}</p>
          <p>Room Id: {roomId}</p>
        </Container>
        <QuestionsContainer
          questions={questions}
          handleSubmitQuestion={handleSubmitQuestion}
          handleAnswerQuestion={handleAnswerQuestion}
          loggedIn={loggedIn}
        />
        <TagsContainer
          tags={tags}
          loggedIn={loggedIn}
          addTag={addTag}
          socket={socket}
          roomId={roomId}
          score={score}
        />
      </Container>
      {!submitRating && (
        <Container
          fluid
          style={{ height: footerStyles.height }}
          className='text-white m-0 rating-container fixed-bottom py-2 d-flex flex-column justify-content-center align-items-center'
        >
          <h4 className='my-2 mb-2 px-3'>How did you find today's session?</h4>
          <RatingContainer handlechange={setRating} />
          <Button
            className='btn btn-light btn-lg'
            type='submit'
            onClick={() => handleSubmitOverallRating()}
          >
            Submit
          </Button>
        </Container>
      )}
    </Container>
  );
}

export default Room;
