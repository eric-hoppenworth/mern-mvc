module.exports =
`import React from 'react';
import "./style.css";
import {Link} from 'react-router-dom';

const Splash = (props)=> {
	return (
		<div>
			<h1>Tell me a secret</h1>
			<label>Your Secret:</label><br/>
			<input value = {props.secretWord} onChange = {props.handleChange} name='secretWord' type='text'/>
            <Link to = "/home" >Go In</Link>

		</div>
	);
};

export default Splash;`;
