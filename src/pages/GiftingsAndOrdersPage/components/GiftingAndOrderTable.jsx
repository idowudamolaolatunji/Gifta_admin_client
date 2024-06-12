import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { dateConverter, numberFormatter, truncate } from "../../../utils/helper";
import Spinner from "../../../components/Spinner";

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

	// const all 

	function Message() {
        return (<p className="no--message" style={{ margin: '2rem auto' }}>No {filterTab === 'all' ? 'Gifting' : `${filterTab} Gifting`}</p>) 
    }

	useEffect(function() {
		async function fetchGiftings() {
			try {
				setIsLoading(true);

				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/`, {
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
						<img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${row?.gift?.images[0]}`} alt={row?.gift?.name} />
						<p>{row?.gift?.name}</p>
					</div>
				);
			},
		},
		{
			name: "Gifter Email",
			selector: (row) => row?.gifter?.email,
		},
		{
			name: "Celebrant or Event",
			selector: (row) =>{
				return (
                    <div className='table-flex table-image-user'>
                        <img src={row?.celebrantImage ? `${import.meta.env.VITE_SERVER_ASSET_URL}/others/${row?.celebrantImage}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row.fullName || row.username} />
                        <p>{truncate(row?.celebrant, 15)}</p>
                    </div>
                )
			},
        },
		{
			name: "Price",
			selector: (row) => `₦${numberFormatter(row?.amount)}`,
			width: '120px'
		},
		{
			name: "Location",
			selector: (row) => row?.state + ', ' + row?.country || 'Nigeria',
		},
		{
			name: "Delivary Date",
			selector: (row) => dateConverter(row?.createdAt),
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
				noDataComponent={<Message />}
			/>
		</div>
	);
}


function OrderTable() {
	const [filterTab, setFilterTab] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [orders, setOrders] = useState([]);

	function Message() {
        return (<p className="no--message" style={{ margin: '2rem auto' }}>No {filterTab === 'all' ? 'Order' : `${filterTab} Order`}</p>) 
    }

	useEffect(function() {
		async function fetchOrders() {
			try {
				setIsLoading(true);

				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/orders/all-order`, {
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
				console.log(data, 'Line 148')

				setOrders(data.data.orders);
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
						<img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${row?.gift?.images[0]}`} alt={row?.gift?.name} />
						<p>{row?.gift?.name}</p>
					</div>
				);
			},
		},
		{
			name: "Gifter Email",
			selector: (row) => row?.gifter?.email,
		},
		{
			name: "Celebrant or Event",
			selector: (row) =>{
				return (
                    <div className='table-flex table-image-user'>
                        <img src={row?.celebrantImage ? `${import.meta.env.VITE_SERVER_ASSET_URL}/others/${row?.celebrantImage}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row.fullName || row.username} />
                        <p>{truncate(row?.celebrant, 15)}</p>
                    </div>
                )
			},
        },
		{
			name: "Price",
			selector: (row) => `₦${numberFormatter(row?.amount)}`,
			width: '120px'
		},
		// {
		// 	name: "State",
		// 	selector: (row) => row?.state,
		// },
		{
			name: "Order Date",
			selector: (row) => dateConverter(row?.createdAt),
		},
		{
			name: "Delivery Stat",
			selector: (row) => row?.status,
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
				noDataComponent={<Message />}
			/>
		</div>
	)
}



function GiftAndOrderComponent() {
	return (
		<>
			<GiftingTable />
			<OrderTable />
		</>
	)
}
export default GiftAndOrderComponent;
