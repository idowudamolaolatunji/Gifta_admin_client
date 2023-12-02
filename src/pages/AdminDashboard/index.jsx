import React, { useState } from "react";

import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsBell } from "react-icons/bs";
import { BsJournalBookmark } from "react-icons/bs";
import { TfiGift } from "react-icons/tfi";
import { BsShop } from "react-icons/bs";
import { TbUsersPlus } from "react-icons/tb";
import { RxGear } from "react-icons/rx";


import { AiOutlineBell } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";

import "./main.css";

// import Logo from '../../assets/image/logo.png'
import Logo from '../../assets/image/logo-full.png'
import MainDashboard from "../../components/MainDashboard";
import UsersTable from "../../components/UsersTable";
import ReminderTable from "../../components/ReminderTable";
import ProductTable from "../../components/ProductTable";
import WishlishTable from "../../components/WishlishTable";
import GiftingTable from "../../components/GiftingTable";
import OnboardingVendors from "../../components/OnboardingVendors";
import Settings from "../../components/Settings";

function index() {
	const [activeTab, setActiveTab] = useState("dashboard");

	const changeTab = (tabName) => {
	  setActiveTab(tabName);
	};

	return (
		<main className="admin__dashboard">
			<menu className="admin__sidebar">
				<span id="logo-container">
					<img src={Logo} alt={Logo} />
				</span>
				<ul className="sidebar--list">

					<li className={`sidebar--item ${activeTab === 'dashboard' ? 'sidebar--active' : ''}`} onClick={() => changeTab("dashboard")} >
						<LuLayoutDashboard className="sidebar--icon" /> Dashboard
					</li>

					<li className={`sidebar--item ${activeTab === 'user' ? 'sidebar--active' : ''}`} onClick={() => changeTab("user")} >
						<HiOutlineUsers className="sidebar--icon" /> All Users
					</li>

					<li className={`sidebar--item ${activeTab === 'reminder' ? 'sidebar--active' : ''}`} onClick={() => changeTab("reminder")} >
						<BsBell className="sidebar--icon" /> Reminders
					</li>

					<li className={`sidebar--item ${activeTab === 'product' ? 'sidebar--active' : ''}`} onClick={() => changeTab("product")} >
						<BsShop className="sidebar--icon" /> Gift Products
					</li>

					<li className={`sidebar--item ${activeTab === 'wishlist' ? 'sidebar--active' : ''}`} onClick={() => changeTab("wishlist")} >
						<BsJournalBookmark className="sidebar--icon" /> Wishlists
					</li>

					<li className={`sidebar--item ${activeTab === 'gifting' ? 'sidebar--active' : ''}`} onClick={() => changeTab("gifting")} >
						<TfiGift className="sidebar--icon" /> Giftings
					</li>
					<li className={`sidebar--item ${activeTab === 'onboarding' ? 'sidebar--active' : ''}`} onClick={() => changeTab("onboarding")} >
						<TbUsersPlus className="sidebar--icon" /> Onboard Vendors
					</li>
					{/* <li className={`sidebar--item ${activeTab === 'settings' ? 'sidebar--active' : ''}`} onClick={() => changeTab("settings")} >
						<RxGear className="sidebar--icon" /> Settings
					</li> */}
				</ul>
			</menu>


			<div className="admin__main">
				<nav className="admin__nav">
					<span>
						<AiOutlineBell className="nav--icon bell" />
						<RiAdminLine className="nav--icon admin" />
						<HiOutlineLogout className="nav--icon logout" />
					</span>
				</nav>

				<section className="admin__container">
					{activeTab === "dashboard" && <MainDashboard />}
					{activeTab === "user" && <UsersTable />}
					{activeTab === "reminder" && <ReminderTable />}
					{activeTab === "product" && <ProductTable />}
					{activeTab === "wishlist" && <WishlishTable />}
					{activeTab === "gifting" && <GiftingTable />}
					{activeTab === "onboarding" && <OnboardingVendors />}
					{/* {activeTab === "settings" && <Settings />} */}
				</section>
			</div>
		</main>
	);
}

export default index;
