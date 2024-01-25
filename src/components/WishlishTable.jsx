import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { dateConverter } from "../utils/helper";
import Spinner from "./Spinner";

const customStyles = {
	head: {
		style: {
			fontSize: "12px",
			fontWeight: "bold",
			color: "#555",
		},
	},
	rows: {
        style: {
            minHeight: '55px',
        },
    },
};


function WishlishTable() {
	const [filterTab, setFilterTab] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [wishlists, setWishlists] = useState([]);



	useEffect(function() {
		async function fetchWishlists() {
			try {
				setIsLoading(true);

				const res = await fetch('https://test.tajify.com/api/wishlists/', {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
					}
				});

				if(!res.ok) {
					throw new Error('Something went wrong!');
				}

				const data = await res.json();
				if(data.status !== "success") {
					throw new Error(data.message);
				}

				setWishlists(data.data.wishLists);
			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchWishlists();
 	}, []);


	const columns = [
		{
			name: "User Details",
			selector: (row) => {
				return (
					<div className="table-flex table-image-user">
						<img src={row?.user.image ? `https://test.tajify.com/asset/users/${row.user.image}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row.user.username} />
						<p>{row.user.username}</p>
					</div>
				);
			},
		},
		{
			name: "Wishlist title",
			selector: (row) => row.name,
		},
		{
			name: "Category",
			selector: (row) => row.category,
		},
		{
			name: "Wishes",
			selector: (row) => row.wishes.length,
		},
		{
			name: "Amount Made",
			selector: (row) => row.amountMade || '₦0.00'
		},
		{
			name: "Wished At",
			selector: (row) => dateConverter(row.createdAt),
		},
	];

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<span className="heading__text">Wishlists</span>
				<div className="dashboard-filter_tabs">
					<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
					<span className={`dashboard_tab ${filterTab === 'highProfit' ? 'active' : ''}`} onClick={() => setFilterTab('highProfit')}>High Profit</span>
					<span className={`dashboard_tab ${filterTab === 'lowProfit' ? 'active' : ''}`} onClick={() => setFilterTab('lowProfit')}>Low Profit</span>
				</div>
			</div>

			<DataTable
				data={wishlists}
				columns={columns}
				pagination
				customStyles={customStyles}
				highlightOnHover
				progressPending={isLoading}
				persistTableHead
				progressComponent={<Spinner />}
			/>
		</div>
	);
}

export default WishlishTable;
