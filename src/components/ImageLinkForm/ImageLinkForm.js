import React from "react";
import './ImageLinkForm.css';



const ImageLinkForm = ({ onInputChange , onButtonSubmit }) => {
  return (
    <div>
      <p className='black f3'>
        {'This Magic Brain will detect faces in your pictures. Give it a try!'}
      </p>
      <div className='center'>
        <div className='pa4 shadow-5 br3 form center'>
          <input 
            className='f4 pa2 w-70 center' 
            type='text' 
            onChange={onInputChange} 
          />
          <button 
            className='f4 link ph3 pv2 dib white bg-light-purple w-30 grow' 
            onClick={onButtonSubmit} >
              Detect
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;