import React, { useEffect, useState } from "react";

import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { AiOutlineShop } from "react-icons/ai";
import { IoAlarmOutline } from "react-icons/io5";
import { GoGift } from "react-icons/go";
import { HiOutlineUsers, HiOutlineShoppingBag } from "react-icons/hi2";
// import ChartComponent from "./ChartComponent";
import TransactionTable from "./TransactionTable";



function MainDashboard() {
    const [selectedTab, setSeletedTab] = useState('allTime')
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [giftings, setGiftings] = useState([]);
    const [wishLists, setWishLists] = useState([]);
    const [giftProducts, setGiftProducts] = useState([]);
    const vendors = users?.filter(user => user.role === 'vendor');
    
    useEffect(function() {
        async function dashboardFetch() {
            try {
                setIsLoading(true);

                const [usersRes, remindersRes, giftingsRes, wishListsRes, giftProductsRes] = await Promise.all([
                    await fetch('https://api-gifta.cyclic.app/api/users/'),
                    await fetch('https://api-gifta.cyclic.app/api/reminders/every-reminder'),
                    await fetch('https://api-gifta.cyclic.app/api/giftings/'),
                    await fetch('https://api-gifta.cyclic.app/api/wishlists/'),
                    await fetch('https://api-gifta.cyclic.app/api/gift-products/products'),
                ]);

                if(!usersRes.ok || !remindersRes.ok || !giftingsRes.ok || !wishListsRes.ok) {
                    throw new Error('Something went wrong!');
                }

                const usersData = await usersRes.json();
                const remindersData = await remindersRes.json();
                const giftingsData = await giftingsRes.json();
                const wishListsData = await wishListsRes.json();
                const giftProductsData = await giftProductsRes.json();

                setUsers(usersData.data.users);
                setReminders(remindersData.data.reminders);
                setGiftings(giftingsData.data.giftings);
                setWishLists(wishListsData.data.wishLists);
                setGiftProducts(giftProductsData.data.giftProducts);

            } catch(err) {
                console.log(err);
            } finally {
                setIsLoading(false)
            }
        }
        dashboardFetch();
    }, []);


	return (
		<div className="dashboard">
			<div className="dashboard_container">

				<div className="dashboard_top">
					<span className="heading__text">Dashboard</span>
					<div className="dashboard-filter_tabs">
                        <span className={`dashboard_tab ${selectedTab === 'allTime' ? 'active' : ''}`} onClick={() => setSeletedTab('allTime')}>All Time</span>
                        <span className={`dashboard_tab ${selectedTab === 'last7Days' ? 'active' : ''}`} onClick={() => setSeletedTab('last7Days')}>Last 7 Days</span>
                        <span className={`dashboard_tab ${selectedTab === 'last14Days' ? 'active' : ''}`} onClick={() => setSeletedTab('last14Days')}>Last 14 Days</span>
                        <span className={`dashboard_tab ${selectedTab === 'last30Days' ? 'active' : ''}`} onClick={() => setSeletedTab('last30Days')}>Last 30 Days</span>
					</div>
				</div>

                <div className="dashboard_insights">
                    <div className="insight">
                        <span className="insight__icon"><LiaMoneyBillWaveSolid className="icon" /></span>
                        <span className="insight__details">
                            <p>Profits</p>
                            <p>₦0.00</p>
                        </span>
                    </div>
                    <div className="insight">
                        <span className="insight__icon"><HiOutlineUsers className="icon" /></span>
                        <span className="insight__details">
                            <p>Users</p>
                            <p>{users.length}</p>
                        </span>
                    </div>
                    <div className="insight">
                        <span className="insight__icon"><AiOutlineShop className="icon" /></span>
                        <span className="insight__details">
                            <p>Vendors</p>
                            <p>{vendors.length}</p>
                        </span>
                    </div>
                    <div className="insight">
                        <span className="insight__icon"><IoAlarmOutline className="icon" /></span>
                        <span className="insight__details">
                            <p>Reminders</p>
                            <p>{reminders.length}</p>
                        </span>
                    </div>
                    <div className="insight">
                        <span className="insight__icon"><HiOutlineShoppingBag className="icon" /></span>
                        <span className="insight__details">
                            <p>Products</p>
                            <p>{giftProducts.length}</p>
                        </span>
                    </div>
                    <div className="insight">
                        <span className="insight__icon"><GoGift className="icon" /></span>
                        <span className="insight__details">
                            <p>Giftings</p>
                            <p>{giftings.length}</p>
                        </span>
                    </div>
                    <div className="insight">
                        <span className="insight__icon"><GoGift className="icon" /></span>
                        <span className="insight__details">
                            <p>WishLists</p>
                            <p>{wishLists.length}</p>
                        </span>
                    </div>
                </div>


                <TransactionTable />

			</div>
		</div>
	);
}

export default MainDashboard;
