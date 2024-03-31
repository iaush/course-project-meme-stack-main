import './Question.css';

function Question({
  _id,
  submitter,
  question,
  answer,
  setSelectedQuestion,
  selected,
}) {
  function handleClick(e) {
    setSelectedQuestion(_id);
  }

  return (
    <div
      className='questionGroup rounded my-3'
      onClick={handleClick}
      style={
        selected
          ? { background: 'teal', color: 'white', border: '1px solid teal' }
          : {}
      }
    >
      <div className='question'>
        {submitter}: {question}
      </div>
      {answer && (
        <div className='answer'>
          <hr />
          Answer: {answer}
        </div>
      )}
    </div>
  );
}

export default Question;
