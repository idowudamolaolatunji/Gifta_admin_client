import React, { useEffect, useState } from 'react';

import DataTable from "react-data-table-component";
import { dateConverter } from "../utils/helper";
import Spinner from './Spinner';
import ChartComponent from "./ChartComponent";

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

function TransactionTable() {
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterTab, setFilterTab] = useState('all');

	const deposits = transactions?.filter(transaction => transaction.purpose === 'deposit')
	const withdrawals = transactions?.filter(transaction => transaction.purpose === 'withdrawal')
	const subscriptions = transactions?.filter(transaction => transaction.purpose === 'subscription')
	const giftings = transactions?.filter(transaction => transaction.purpose === 'gifting')

	useEffect(function() {
		async function fetchTransactions() {
			try {
				setIsLoading(true);
				const res = await fetch('https://test.tajify.com/api/transactions/', {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					}
				});

				if(!res.ok) {
					throw new Error('Something went wrong!');
				}

				const data = await res.json();
				if(data.status !== "success") {
					throw new Error(data.message);
				}

				setTransactions(data.data.transactions);
				console.log(data.data.transactions)

			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchTransactions();
	}, [])


    const columns = [
		{
			name: "User Details",
			selector: (row) => {
				return (
					<div className="table-flex table-image-user">
						<img src={row.user.image} alt={row.user.username} />
						<p>{row.user.username}</p>
					</div>
				);
			},
		},
		
		{
			name: "Purpose",
			selector: (row) => row.purpose,
		},
		{
			name: "Amount",
			selector: (row) => row.amount,
		},
		{
			name: "Status",
			selector: (row) => row.status,
		},
		{
			name: "Refrence",
			selector: (row) => row.reference,
		},
		{
			name: "Paid At",
			selector: (row) => dateConverter(row.createdAt),
		},
	];


    return (
		<>

			<div className="chart-container">
				<span className="sub_heading">Transaction Chart.</span>
                    <ChartComponent deposits={deposits.length} withdrawals={withdrawals.length} subscriptions={subscriptions.length} giftings={giftings.length} />
			</div>

			<div className="dashboard_bottom">
                <>
					<div className="dashboard_top">
						<span className="sub_heading">All Transaction</span>
						<div className="dashboard-filter_tabs">

							<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
							<span className={`dashboard_tab ${filterTab === 'deposits' ? 'active' : ''}`} onClick={() => setFilterTab('deposits')}>Deposit</span>
							<span className={`dashboard_tab ${filterTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setFilterTab('withdrawals')}>Withdrawal</span>
							<span className={`dashboard_tab ${filterTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setFilterTab('subscriptions')}>Subscription</span>
							<span className={`dashboard_tab ${filterTab === 'giftings' ? 'active' : ''}`} onClick={() => setFilterTab('giftings')}>Giftings</span>
						</div>
					</div>

					<DataTable
						data={filterTab === 'all' ? transactions : filterTab === 'deposits' ? deposits : filterTab === 'withdrawals' ? withdrawals : filterTab === 'subscriptions' ? subscriptions : filterTab === 'giftings' ? giftings : ''}
						columns={columns}
						pagination
						customStyles={customStyles}
						highlightOnHover
						persistTableHead
						progressPending={isLoading}
						progressComponent={<Spinner />}
					/>
				</>
			</div>
		</>
	);
}

export default TransactionTable;