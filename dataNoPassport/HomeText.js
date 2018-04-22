module.exports =
`import React from 'react';
import "./style.css";

const Home = (props) =>{
	return (
		<div>
			<h1>Is this your secret word?</h1>
			<p>{props.secret}</p>
		</div>
	);
};

export default Home;`;
