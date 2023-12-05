import React, { useState } from "react";

import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

import Spinner from "./Spinner";
import Alert from "./Alert";

function OnboardingVendors() {
	const [fullname, setFullname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	// /signup-vendor

	function handleCancel() {
		setEmail("");
		setFullname("");
		setUsername("");
		setPassword("");
		setPasswordConfirm("");
	}

	function handleReset() {
		setIsError(false);
		setIsSuccess(false);
		setMessage("");
	}

	function validate(e) {
		e.preventDefault();
		if (
			fullname !== "" &&
			username !== "" &&
			email !== "" &&
			password !== "" &&
			passwordConfirm !== ""
		) {
			handleCreateVendors(e);
		} else {
			setIsError(true);
			setMessage("Fields Incomplete");
		}
	}

	async function handleCreateVendors(e) {
		try {
			setIsLoading(true);
			handleReset();

			const res = await fetch("https://api-gifta.cyclic.app/api/users/signup-vendor", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					username: username.split(" ").join("_"),
					fullName: fullname,
					password,
					passwordConfirm,
				}),
			});

			if (!res.ok) {
				throw new Error("Something went wrong!");
			}

			const data = await res.json();
			if (data.status !== "success") {
				throw new Error(data.message);
			}

			setIsSuccess(true);
			setMessage(data.message);

			setTimeout(function () {
				setIsSuccess(false);
				setMessage("");
			}, 1200);
		} catch (err) {
			setIsError(true);
			setMessage(err.message);
			setTimeout(function () {
				setIsError(false);
				setMessage("");
			}, 2000);
		} finally {
			setIsLoading(false);
			handleCancel();
		}
	}

	return (
		<>
			<div className="dashboard_container" style={{ position: "relative" }}>
				{isLoading && (
					<div className="onboard">
						<Spinner />
					</div>
				)}
				<div className="dashboard_top">
					<span className="heading__text">Create a new vendor.</span>
				</div>

				<div className="onboard_box">
					<form className="form" onSubmit={validate}>
						<div className="form__item">
							<label htmlFor="fullname" className="form__label">
								Full Name
							</label>
							<input
								value={fullname}
								onChange={(e) => setFullname(e.target.value)}
								type="text"
								id="fullname"
								placeholder="Enter Fullname"
								className="form__input"
							/>
						</div>
						<div className="form__item">
							<label htmlFor="username" className="form__label">
								Store Name
							</label>
							<input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								type="text"
								id="username"
								placeholder="Enter Store Name"
								className="form__input"
							/>
						</div>
						<div className="form__item">
							<label htmlFor="email" className="form__label">
								Email Address
							</label>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								id="email"
								placeholder="Enter Email"
								className="form__input"
							/>
						</div>
						<div className="form__item">
							<label htmlFor="password" className="form__label">
								Password (min 8 characters)
							</label>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								id="password"
								placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
								className="form__input"
							/>
						</div>
						<div className="form__item">
							<label htmlFor="password-confirm" className="form__label">
								Repeat Password
							</label>
							<input
								value={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)}
								type="password"
								id="password-confirm"
								placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
								className="form__input"
							/>
						</div>

						<div className="form__item form__actions">
							<button
								className="form__button form__cancel"
								type="button"
								onClick={handleCancel}
							>
								Cancel
							</button>
							<button className="form__button form__submit" type="submit">
								Create Vendor
							</button>
						</div>
					</form>
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

export default OnboardingVendors;
