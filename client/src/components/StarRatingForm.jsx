import { useState } from 'react';
import './StarRatingForm.css';
import { Form } from 'react-bootstrap';
import useUserStore from '../stores/userStore';

// https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6

function StarRatingForm({ selectedTag, socket, roomId }) {
  const [hover, setHover] = useState(false);
  const [rating, setRating] = useState(0);
  const { username, submittedScores, setSubmittedScores, anonymous } = useUserStore(
    (store) => ({
      username: store.username,
      setSubmittedScores: store.setSubmittedScores,
      submittedScores: store.submittedScores,
      anonymous: store.anonymous
    })
  );
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    let submitted = submittedScores.map((s) => s.tagId);
    if (submitted.includes(selectedTag)) {
      setError('Already submitted for this tag');
      return;
    }
    socket.emit(
      'submitTagRating',
      JSON.stringify({
        tagId: selectedTag,
        rating,
        roomId,
        username: anonymous ? username + '-' + roomId : username,
      })
    );

    socket.on('submitTagScoreSuccess', function (response) {
      if (!response) return;
      response = JSON.parse(response);
      setSubmittedScores(response.data);
    });
  };

  return (
    <Form onSubmit={onSubmit} className='py-4'>
      <h5 style={{ textAlign: 'center' }}>
        How well did you understand this topic?
      </h5>
      <div className='d-flex justify-content-center align-items-center my-4'>
        <div className='star-rating'>
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type='button'
                key={index}
                className={index <= (hover || rating) ? 'on' : 'off'}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <span className='star'>&#9733;</span>
              </button>
            );
          })}
        </div>
        <button className='btn btn-primary btn-sm mx-2'>Submit</button>
      </div>
      <div className='d-flex justify-content-center align-items-center'>
        {error && <span className='errorMsg'>{error}</span>}
      </div>
    </Form>
  );
}

export default StarRatingForm;
