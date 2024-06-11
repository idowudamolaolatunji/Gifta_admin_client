import React, { useState } from "react";

import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";

function OnboardForms() {
	const [fullname, setFullname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [adminType, setAdminType] = useState('');

	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [tab, setTab] = useState('vendor')

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

			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/signup-vendor`, {
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
					<span className="heading__text">Create a new {tab}.</span>

					<div className="dashboard-filter_tabs">
						<span className={`dashboard_tab ${tab === 'vendor' ? 'active' : ''}`} onClick={() => setTab('vendor')}>Vendor</span>
						<span className={`dashboard_tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>Admin</span>
					</div>
				</div>

				<div className="onboard_box">
					<form className="form" onSubmit={validate}>
						{tab === 'vendor' && (
							<>
								<div className="form__item">
									<label htmlFor="fullname" className="form__label">
										Vendor's Full Name
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
										Store Name / Username
									</label>
									<input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										type="text"
										id="username"
										placeholder="Enter Store Name / Username"
										className="form__input"
									/>
								</div>
							</>
						)}

						{tab === 'admin' && (
							<>
								<div className="form__item">
									<label htmlFor="name" className="form__label">
										Admin Name
									</label>
									<input
										value={fullname}
										onChange={(e) => setFullname(e.target.value)}
										type="text"
										id="name"
										placeholder="Enter Admin Name"
										className="form__input"
									/>
								</div>
								<div className="form__item">
									<label htmlFor="type" className="form__label">
										Role Type
									</label>
									<select value={adminType} id="type" className="form__input" onChange={(e) => setAdminType(e.target.value)}>
										<option hidden selected>-- Admin Role --</option>
										<option value="sub-admin">Sub Admin</option>
										<option value="main-admin">Admin</option>
									</select>
								</div>
							</>
						)}
						<div className="form__item">
							<label htmlFor="email" className="form__label">
								{tab.replace(tab.slice(0, 1), tab.slice(0, 1).toUpperCase())}'s Email Address
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
								Create {tab.replace(tab.slice(0, 1), tab.slice(0, 1).toUpperCase())}
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

export default OnboardForms;
