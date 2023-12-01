import React from "react";
import '../AdminAuth/main.css'

import Logo from "../../assets/image/logo-full.png";

function index() {
	return (

		<div className="login_main">
			<div className="login_container">
            <img src={Logo} alt={Logo} className="login_auth" />
			<h3 className="login_heading">Log in to your account!</h3>

			<div className="login">
				<form className="login_form">
					<div className="form__item">
						<label htmlFor="email" className="form__label">
							Email Address
						</label>
						<input type="email" placeholder="johndoe@example.com" id="email" className="form__input" />
					</div>
					<div className="form__item">
						<label htmlFor="password" className="form__label">
							Password
						</label>
						<input type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" id="password" className="form__input" />
					</div>
					<div className="form__item">
						<button className="form__submit">Login</button>
					</div>
				</form>
			</div>
            </div>
		</div>
	);
}

export default index;
