import React from "react";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

function Alert({ alertType, message }) {
	console.log(alertType, message)
	return (
		<div className={`alert alert--${alertType}`}>
            {alertType === 'success' && (
				<AiFillCheckCircle className="alert--icon" />
			)}
				
			{alertType === 'error' && (
				<AiFillExclamationCircle className="alert--icon" />
			)}

			<p>{message}</p>
		</div>
	);
}

export default Alert;
