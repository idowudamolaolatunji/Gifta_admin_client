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

function GiftingTable() {
	const [filterTab, setFilterTab] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [giftings, setGiftings] = useState([]);



	useEffect(function() {
		async function fetchGiftings() {
			try {
				setIsLoading(true);

				const res = await fetch('https://test.tajify.com/api/giftings/', {
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

				setGiftings(data.data.giftings);
			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchGiftings();
 	}, []);


	const columns = [
		{
			name: "Gift Details",
			selector: (row) => {
				return (
					<div className="table-flex table-product">
						<img src={row.gift.image} alt={row.gift.name} />
						<p>{row.gift.name}</p>
					</div>
				);
			},
		},
		{
			name: "Gifter Email",
			selector: (row) => row.gifter.email,
		},
		{
			name: "Celebrant Name",
			selector: (row) => row.name,
		},
		{
			name: "Price",
			selector: (row) => row.amount,
		},
		{
			name: "State",
			selector: (row) => row.state,
		},
		{
			name: "Delivary Date",
			selector: (row) => dateConverter(row.date),
		},
	];

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<span className="heading__text">User Giftings</span>
				<div className="dashboard-filter_tabs">
					<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
					<span className={`dashboard_tab ${filterTab === 'paidAlready' ? 'active' : ''}`} onClick={() => setFilterTab('paidAlready')}>Already Paid</span>
					<span className={`dashboard_tab ${filterTab === 'delivered' ? 'active' : ''}`} onClick={() => setFilterTab('delivered')}>Delivered</span>
				</div>
			</div>

			<DataTable
				data={giftings}
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


function OrderTable() {
	const [filterTab, setFilterTab] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [orders, setOrders] = useState([]);



	useEffect(function() {
		async function fetchOrders() {
			try {
				setIsLoading(true);

				const res = await fetch('https://test.tajify.com/api/Orders/', {
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

				setOrders(data.data.Orders);
			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchOrders();
 	}, []);


	const columns = [
		{
			name: "Order Gift Details",
			selector: (row) => {
				return (
					<div className="table-flex table-product">
						<img src={row?.gift.image} alt={row?.gift.name} />
						<p>{row?.gift.name}</p>
					</div>
				);
			},
		},
		{
			name: "Gifter Email",
			selector: (row) => row.gifter.fullName,
		},
		{
			name: "Celebrant Name",
			selector: (row) => row.celebrant,
		},
		{
			name: "Price",
			selector: (row) => row.amount,
		},
		{
			name: "State",
			selector: (row) => row.state,
		},
		{
			name: "Order Date",
			selector: (row) => dateConverter(row.createdAt),
		},
		{
			name: "Delivery Stat",
			selector: (row) => row.isDelivered,
		},
	];

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<span className="heading__text">Gift Orders</span>
				<div className="dashboard-filter_tabs">
					<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
					<span className={`dashboard_tab ${filterTab === 'pending' ? 'active' : ''}`} onClick={() => setFilterTab('pending')}>Pending</span>
					<span className={`dashboard_tab ${filterTab === 'delivered' ? 'active' : ''}`} onClick={() => setFilterTab('delivered')}>Delivered</span>
				</div>
			</div>

			<DataTable
				data={orders}
				columns={columns}
				pagination
				customStyles={customStyles}
				highlightOnHover
				progressPending={isLoading}
				persistTableHead
				progressComponent={<Spinner />}
			/>
		</div>
	)
}



function giftAndOrderComponent() {
	return (
		<>
			<GiftingTable />
			<OrderTable />
		</>
	)
}
export default giftAndOrderComponent;
