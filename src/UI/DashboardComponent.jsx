import React, { useState } from "react";

import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineIdentification, HiOutlineUsers } from "react-icons/hi2";
import { BsBell } from "react-icons/bs";
import { BsJournalBookmark } from "react-icons/bs";
import { TfiGift } from "react-icons/tfi";
import { BsShop } from "react-icons/bs";
import { TbUsersPlus } from "react-icons/tb";
import { RxGear } from "react-icons/rx";

import { AiOutlineBell } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";

import Logo from '../assets/image/logo-full.png'
import "./main.css";
import { useAuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";

// import MainDashboard from "../../components/MainDashboard";
// import UsersTable from "../../components/UsersTable";
// import ReminderTable from "../../components/ReminderTable";
// import ProductTable from "../../components/ProductTable";
// import WishlishTable from "../../components/WishlishTable";
// import GiftingTable from "../../components/GiftingTable";
// import OnboardingVendors from "../../components/OnboardingVendors";
// import Settings from "../../components/Settings";
// import KycTable from "../../components/KycTable";


function DashboardComponent({ children }) {
	const [isLoading, setIsLoading] = useState(false);
    
    const { pathname } = useLocation();
    const navigate = useNavigate();
    console.log(pathname)
	const { logout } = useAuthContext();


	function handleLogout () {
		setIsLoading(true);
		logout();

		// logging out
		setTimeout(() => {
			setIsLoading(false)
		}, 2500)
		window.location.reload(true)
	}

	return (
		<>

		{ isLoading && (
			<div className="overlay">
				<Spinner />
			</div>
		)}

		<main className="admin__dashboard">
			<menu className="admin__sidebar">
				<span id="logo-container">
					<img src={Logo} alt={Logo} />
				</span>
				<ul className="sidebar--list">
					<li className={`sidebar--item ${pathname ==='/dashboard' ? 'sidebar--active' : ''}`} onClick={() => navigate("/dashboard")} >
						<LuLayoutDashboard className="sidebar--icon" /> Dashboard
					</li>

					<li className={`sidebar--item ${pathname ==='/users' ? 'sidebar--active' : ''}`} onClick={() => navigate("/users")} >
						<HiOutlineUsers className="sidebar--icon" /> All Users
					</li>

					<li className={`sidebar--item ${pathname ==='/reminders' ? 'sidebar--active' : ''}`} onClick={() => navigate("/reminders")} >
						<BsBell className="sidebar--icon" /> Reminders
					</li>

					<li className={`sidebar--item ${pathname ==='/products' ? 'sidebar--active' : ''}`} onClick={() => navigate("/products")} >
						<BsShop className="sidebar--icon" /> Gift Products
					</li>

					<li className={`sidebar--item ${pathname ==='/wishlists' ? 'sidebar--active' : ''}`} onClick={() => navigate("/wishlists")} >
						<BsJournalBookmark className="sidebar--icon" /> Wishlists
					</li>

					<li className={`sidebar--item ${pathname ==='/giftings-and-orders' ? 'sidebar--active' : ''}`} onClick={() => navigate("/giftings-and-orders")} >
						<TfiGift className="sidebar--icon" /> Giftings & Orders
					</li>
					<li className={`sidebar--item ${pathname ==='/onboarding' ? 'sidebar--active' : ''}`} onClick={() => navigate("/onboarding")} >
						<TbUsersPlus className="sidebar--icon" /> Onboarding
					</li>
					<li className={`sidebar--item ${pathname ==='/kycs' ? 'sidebar--active' : ''}`} onClick={() => navigate("/kycs")} >
						<HiOutlineIdentification className="sidebar--icon" /> KYC
					</li>
					{/* <li className={`sidebar--item ${activeNavTab.includes('settings') ? 'sidebar--active' : ''}`} onClick={() => navigate("/settings")} >
						<RxGear className="sidebar--icon" /> Settings
					</li> */}
				</ul>
			</menu>


			<div className="admin__main">
				<nav className="admin__nav">
					<span>
						<AiOutlineBell className="nav--icon bell" />
						<RiAdminLine className="nav--icon admin" />
						<HiOutlineLogout className="nav--icon logout" onClick={handleLogout} />
					</span>
				</nav>

				<section className="admin__container">
					{/* {activeNavTab === "dashboard" && <MainDashboard />}
					{activeNavTab === "user" && <UsersTable />}
					{activeNavTab === "reminder" && <ReminderTable />}
					{activeNavTab === "product" && <ProductTable />}
					{activeNavTab === "wishlist" && <WishlishTable />}
					{activeNavTab === "gifting" && <GiftingTable />}
					{activeNavTab === "onboarding" && <OnboardingVendors />}
					{activeNavTab === "kyc" && <KycTable />} */}
					{/* {activeNavTab === "settings" && <Settings />} */}

                    {children}
				</section>
			</div>
		</main>
		</>
	);
}

export default DashboardComponent;
