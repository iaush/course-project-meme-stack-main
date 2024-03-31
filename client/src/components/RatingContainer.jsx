import React from 'react';
import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const RatingContainer = (props) => {
  //define each star rating
  const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }
  //change labels values on hover and when selected
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

  return (
    <div className='d-flex justify-content-between'>
      <p> Lecture rating : </p>
      <Rating
        name='hover-feedback'
        value={value}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
          props.handlechange(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} />}
      />
      {value !== null && <p> {labels[hover !== -1 ? hover : value]} </p>}
    </div>
  );
};

export default RatingContainer;
