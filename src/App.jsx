import React from "react";
import MainDashboard from "./pages/MainPage";
import UsersPage from "./pages/UsersPage";
import ReminderPage from "./pages/ReminderPage";
import ProductsPage from "./pages/ProductsPage";
import WishlistPage from "./pages/WishListPAge";
import KycPage from "./pages/KycPage";
import OnboardingPage from "./pages/OnboardingPage";
import AddCategories from "./pages/AddCategories";
import GiftingsAndOrdersPage from "./pages/GiftingsAndOrdersPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from './utils/ProtectedRoute';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<MainDashboard />}></Route>
					<Route path="/dashboard" element={<MainDashboard />}></Route>
					<Route path="/users" element={<UsersPage />}></Route>
					<Route path="/reminders" element={<ReminderPage />}></Route>
					<Route path="/products" element={<ProductsPage />}></Route>
					<Route path="/wishlists" element={<WishlistPage />}></Route>
					<Route path="/giftings-and-orders" element={<GiftingsAndOrdersPage />}></Route>
					<Route path="/onboarding" element={<OnboardingPage />}></Route>
					<Route path="/kycs" element={<KycPage />}></Route>
					<Route path="/categories" element={<AddCategories />}></Route>
				</Route>

                <Route path="/login" element={<AuthPage />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
