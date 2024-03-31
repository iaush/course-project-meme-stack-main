
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Moduletag from './Moduletags';
import QuestionPin from './QuestionPin';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import nusmoderator from 'nusmoderator';
import SessionRatingBar2 from './SessionRatingBar2';
import './modulelandingpage.css';
import '../Common/Button.css';

const Modulelandingpage = (props) => {
  const { getClient } = useUserStore((store) => ({
    getClient: store.getClient,
  }));
  const navigate = useNavigate();
  const weeksSessionData = props.weeksSessionData;
  const [weekNo, setWeekNo] = useState(null);

  const [sessionOptions, setSessionOptions] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [tags, setTags] = useState(null);

  const tagsRef = useRef(null)
  const questionRef = useRef(null)

  const scrollToQuestion = () => {
    questionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTag = () => {
    tagsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const centeredContainer = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '20px',
    alignItems: 'center',
  };

  // Create a random color for module tag 
  const getRandomColor = () => {
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
    }
    return color;
  };

  // Determine the correct week number / reading / recess week
  const setWeekHandler = async (week) => {
    if (weekNo == week) {
      return;
    }
    setTags(null);
    setQuestions(null);

    let weekDataDictionary;
    if (week.length <= 2) {
      weekDataDictionary = weeksSessionData[parseInt(week)];
    } else {
      weekDataDictionary = weeksSessionData[week];
    }
    if (weekDataDictionary.length > 1) {
      createSessionOptions(weekDataDictionary);
    } else {
      setSessionOptions(null);
      createSessionTagsAndQuestions(weekDataDictionary[0]);
    }
    setWeekNo(week);
  };

  //Scroll to reference area when week is selected
  useEffect(()=>{
    scrollToTag()
  },[weekNo])

  //Scroll to reference area when question is selected
  useEffect(()=>{
    scrollToQuestion()
  },[questions])

  //create new room and redirect to room link
  const createRoom = async () => {
    let moduleId = props.module.id;
    let currentDate = new Date();
    const weekInfo = nusmoderator.academicCalendar.getAcadWeekInfo(currentDate);
    const weekNo = weekInfo.num ? weekInfo.num : weekInfo.type;

    let client = getClient();
    await client
      .post(`/api/v1/module/${moduleId}/week/${weekNo}/add`)
      .then((resp) => {
        return navigate(`/module/${moduleId}/room/${resp.data.data}`);
      });
  };

  const createSessionOptions = (weekData) => {
    const sessionOptionButtons = [];
    for (let i = 0; i < weekData.length; i++) {
      sessionOptionButtons.push(
        <Button
          className='custom-button blue-button medium-button'
          key={JSON.stringify(weekData[i]._id)}
          size='lg'
          style={{ padding: '8px !important' }}
          onClick={() => {
            createSessionTagsAndQuestions(weekData[i]);
          }}
        >
          {`Session ${i + 1}`}
        </Button>
      );
    }
    setSessionOptions(sessionOptionButtons);
  };

  //create elements for each tag and maps questions object to specific details to render 
  const createSessionTagsAndQuestions = (sessionData) => {
    const tags = sessionData.tags.map((item) => (
      <Moduletag
        tag={item.name}
        key={JSON.stringify(item._id)}
        color={getRandomColor()}
      />
    ));

    const questions = sessionData.questions.map((item) => {
      return {
        id: JSON.stringify(item._id),
        question: item.question.toString(),
        submitter: item.submitter.toString(),
        question: item.question.toString(),
        answer: item.answer ? item.answer.toString() : '',
        created: new Date(item.created).toLocaleDateString(),
      };
    });

    //Creates question pin elements to display each question submitted by users
    const questionsElements = questions.map((question) => (
      <QuestionPin
        key={question.id}
        submitter={question.submitter}
        created={question.created}
        question={question.question}
        answer={question.answer}
      />
    ));

    setTags(tags);
    setQuestions(questionsElements);
  };

  return (
    <Container
      className='container-fluid'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px auto',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Container className='d-flex flex-column mt-4 align-items-center dashboard-container'>
        <Container>
          <Container style={centeredContainer}>
            <h5>
              {props.module.moduleCode} {props.module.title}
            </h5>
            <span>{props.module.description}</span>
          </Container>
          <Container
            style={{
              padding: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
            className='custom-button blue-button medium-button'
            onClick={() => createRoom()}
          >
              Start a new session
            </Button>
          </Container>
        </Container>
        <h3>Select a week to view data</h3>
        <Container
          fluid
          id='results-bar'
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {weeksSessionData && (
            <SessionRatingBar2
              weeksSessionData={weeksSessionData}
              setWeekHandler={setWeekHandler}
            />
          )}
        </Container>

        {sessionOptions && (
          <Container
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '20px 0',
              alignItems: 'center',
            }}
          >
            <h5>Select a session</h5>

            <Container style={centeredContainer}>{sessionOptions}</Container>
          </Container>
        )}
        <div ref={tagsRef} />
        {tags && <Container> 
          {tags && (
            <Container style={centeredContainer}>
              <h3 style={{ margin: '40px 0' }}>Session Tags:</h3>
              <Container
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
              >
                {tags}
              </Container>
            </Container>
          )}
          <div ref={questionRef} />
          {questions && (
            <Container style={centeredContainer}>
              <h3 style={{ margin: '40px 0' }}>Session Questions:</h3>
              {questions}
            </Container>
          )}
        </Container>}
      </Container>
    </Container>
  );
};

export default Modulelandingpage;
