import userProfile from '../assets/user_profile.png';
import { Container } from 'react-bootstrap';

const QuestionPin = (props) => {
  return (
    <Container
      style={{
        marginBottom: '20px',
        backgroundColor: 'lightcyan',
        border: '1px solid grey',
        borderRadius: '10px',
        padding: '20px',
      }}
    >
      <Container className='d-flex align-items-center justify-content-between'>
        <Container className='d-flex align-items-center'>
          <img src={userProfile} />
          <p className='mx-2'> {props.submitter} </p>
        </Container>

        <Container className='d-flex align-items-center'>
          <p className='mx-1'>{`Date posted: ${props.created}`}</p>
        </Container>
      </Container>
      <Container>
        <h5 className='font-italic text-left'>Question: {props.question}</h5>
        <p>Answer: {props.answer}</p>
      </Container>
    </Container>
  );
};

export default QuestionPin;
