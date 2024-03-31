import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useUserStore from '../stores/userStore';
import StarRatingForm from './StarRatingForm';
import ScoreDistribution from './ScoreDistr';

function TagsContainer({ tags, loggedIn, addTag, socket, roomId, score }) {
  const [selectedTag, setSelectedTag] = useState('');
  const [scoreMap, setScoreMap] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submittedScores = useUserStore((store) => store.submittedScores);

  useEffect(() => {
    let scoreMap = Object.fromEntries(
      submittedScores.map((e) => [e.tagId, e.score])
    );
    setScoreMap(scoreMap);
  }, [submittedScores]);

  const onSubmit = (data) => {
    addTag(data.tagInput);
  };

  const handleSelect = (tag) => {
    setSelectedTag(tag._id);
  };

  /**
   * Submit a tag score to backend
   * @param {number} score
   */
  const submitTagRating = (tagId, score) => {
    socket.emit('addScore', JSON.stringify({ tagId, score }));
  };

  return (
    <div className='m-4'>
      <h3>Tags</h3>
      {tags && <p className='pt-3'>Select a tag to view rating</p>}
      <div className='tagsContainer d-flex'>
        {tags.map((tag, i) => {
          return (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: tag ? (tag.name.length + 1) * 18 : '150px',
                padding: '5px 10px',
                backgroundColor: selectedTag == tag._id ? 'teal' : 'white',
                border: '1px solid teal',
                borderRadius: '15px',
                fontSize: '16px',
                fontWeight: '700',
                color: selectedTag == tag._id ? 'white' : 'teal',
                margin: '10px 0',
                marginRight: '10px',
              }}
              key={tag.name}
              onClick={() => handleSelect(tag)}
            >
              {tag.name} {scoreMap[tag._id]}
            </span>
          );
        })}
      </div>
      {selectedTag !== '' && (
        // && !loggedIn # TODO: uncomment out in prod
        <>
          <div className='d-flex justify-content-center'>
            <StarRatingForm
              selectedTag={selectedTag}
              socket={socket}
              roomId={roomId}
            />
          </div>

          {loggedIn && (
            <div
              style={{
                width: '80%',
                margin: 'auto',
              }}
            >
              <ScoreDistribution
                selectedTag={selectedTag}
                score={score.filter((x) => x.tagId == selectedTag)}
              />
            </div>
          )}
        </>
      )}
      {loggedIn && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='input-group' id='questionInputBox'>
            <input
              type='text'
              className='form-control'
              placeholder='Add tag'
              aria-label='Add tag'
              aria-describedby='button-addon'
              {...register('tagInput', { required: true })}
            />
            <input
              type='submit'
              className='btn btn-outline-secondary'
              id='button-addon'
            />
          </div>
          {errors.tagInput && (
            <span className='errorText'>This field is required</span>
          )}
        </form>
      )}
    </div>
  );
}

export default TagsContainer;
