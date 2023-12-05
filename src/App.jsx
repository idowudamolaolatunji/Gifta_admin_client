import React from "react";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./pages/AdminAuth";
import ProtectedRoute from './Auth/ProtectedRoute';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<AdminDashboard />}></Route>
					<Route path="/dashboard" element={<AdminDashboard />}></Route>
				</Route>

                <Route path="/login" element={<AdminAuth />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
