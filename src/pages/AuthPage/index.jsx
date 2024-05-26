import React, { useEffect, useState } from "react";
import "./main.css";
import Spinner from "../../components/Spinner";

import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

import Logo from "../../assets/image/logo-full.png";
import { useAuthContext } from "../../context/AuthContext";
import Alert from "../../components/Alert";
import { Link, useNavigate } from "react-router-dom";

function index() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const navigate = useNavigate();
	const { admin, handleChange } = useAuthContext();

	function handleError(mess) {
		setIsError(true);
		setMessage(mess);
		setTimeout(() => {
			setIsError(false);
			setMessage("");
		}, 2500);
	}

	function handleReset() {
		setIsError(false);
		setIsSuccess(false);
		setMessage("");
	}

	async function handleLogin(e) {
		try {
			e.preventDefault();
			setIsLoading(true);
			handleReset();

			if (email === "" || password === "") {
				throw new Error("Fields Empty");
			}

			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/admin-login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error("Something went wrong!");
			}

			const data = await res.json();
			if (data.status !== "success") {
				throw new Error(data.message);
			}
			setMessage("Admin Login Successful");
			setIsSuccess(true);
			setTimeout(() => {
				setIsError(false);
				setMessage("");
				handleChange(data.data.admin, data.token);
			}, 1200);
		} catch (err) {
			handleError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (admin) {
			navigate("/dashboard");
		}
	}, [admin]);

	return (
		<>
			{isLoading && (
				<div className="overlay">
					<Spinner />
				</div>
			)}
			<div className="login_main">
				<div className="login_container">
					<img src={Logo} alt={Logo} className="login_auth" />
					<h3 className="login_heading">Log in to your account!</h3>

					<div className="login">
						<form className="login_form" onSubmit={handleLogin}>
							<div className="form__item">
								<label htmlFor="email" className="form__label">
									Email Address
								</label>
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									placeholder="johndoe@example.com"
									id="email"
									className="form__input"
								/>
							</div>
							<div className="form__item">
								<label htmlFor="password" className="form__label">
									Password
								</label>
								<input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									type="password"
									placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
									id="password"
									className="form__input"
								/>
							</div>
							<div className="form__item">
								<button className="form__submit">Login</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
				{isSuccess ? (
					<AiFillCheckCircle className="alert--icon" />
				) : isError ? (
					<AiFillExclamationCircle className="alert--icon" />
				) : (
					""
				)}
				<p>{message}</p>
			</Alert>
		</>
	);
}

export default index;
