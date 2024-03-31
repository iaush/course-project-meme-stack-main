//Not in use
import React from 'react';

const TagContainer = (props) => {
  return (
    <div>
      <input
        className='w-100 form-control-sm'
        type='text'
        placeholder='Topic covered'
        onChange={(event) => props.handlechange(event.target.value)}
      ></input>
    </div>
  );
};

export default TagContainer;
