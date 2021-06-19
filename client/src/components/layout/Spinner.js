// racf
import React, { Fragment } from 'react'
import spinnerGif from './spinner.gif';

const Spinner = () => {
    return (
        <Fragment>
            <img src={spinnerGif} alt="loading" style={{width: 200, display: 'block', margin: 'auto'}}/>
        </Fragment>
    );
}

export default Spinner;


