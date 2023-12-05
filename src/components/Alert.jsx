import React from "react";

function Alert({ children, alertType }) {
	return (
		<div className={`alert alert--${alertType}`}>
            {children}
		</div>
	);
}

export default Alert;
