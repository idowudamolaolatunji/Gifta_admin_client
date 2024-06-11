import React, { useEffect, useState, useTransition } from 'react';

import DataTable from "react-data-table-component";
import { capitalizeFirstLetter, currencyConverter, dateConverter, numberFormatter, truncate } from "../../../utils/helper";
import Spinner from '../../../components/Spinner';
import ChartComponent from "./ChartComponent";
import Alert from '../../../components/Alert';
import DashboardModal from '../../../components/DashboardModal';
import MiniSpinner from '../../../components/MiniSpinner';
import { useAuthContext } from '../../../context/AuthContext';

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

const customStyleModal = {
    minHeight: "auto",
    maxWidth: "44rem",
    width: "44rem",
    zIndex: 300000
};

function TransactionTable({ setMainLoader }) {
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterTab, setFilterTab] = useState('all');
	const [showModal, setShowModal] = useState(false);
	const [showActionModal, setShowActionModal] = useState(false);

	const [action, setAction] = useState('')
	const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [refecthHelp, setRefecthHelp] = useState(false);

	const [adminPassword, setAdminPassword] = useState('');
	const [isLoadingDoc, setIsLoadingDoc] = useState(true);
	///////////////////////////////////////////////////////////////////
	const [selectedTransactionId, setSelectedTransactionId] = useState(null);
	const [selectedTransactionUserId, setSelectedTransactionUserId] = useState(null);
	const [seletedTransactionType, setSelectedTransactionType] = useState('');
	const [seletedUserName, setSelectedUserName] = useState('');
	///////////////////////////////////////////////////////////////////
	const [userTransaction, setUserTransaction] = useState(null);

	const deposits = transactions?.filter(transaction => transaction.purpose === 'deposit')
	const withdrawals = transactions?.filter(transaction => transaction.purpose === 'withdrawal')
	const subscriptions = transactions?.filter(transaction => transaction.purpose === 'subscription')
	const giftings = transactions?.filter(transaction => transaction.purpose === 'gifting');
	const wishes = transactions?.filter(transaction => transaction.purpose === 'wishes');
	const orders = transactions?.filter(transaction => transaction.purpose === 'order');
	const redeemed = transactions?.filter(transaction => transaction.purpose === 'redeemed');
	const transactionObj = { deposits, withdrawals, subscriptions, giftings, wishes, orders, redeemed };

	const { token } = useAuthContext();


	function Message() {
        return (<p className="no--message" style={{ margin: '2rem auto' }}>No {filterTab !== 'all' ? filterTab : ''} document</p>) 
    }
    

	function handleTransactionModal(item) {
		setShowModal(true);
		setSelectedTransactionId(item?._id);
		setSelectedTransactionUserId(item?.user?._id);
		setSelectedTransactionType(item?.purpose)
		setSelectedUserName(item?.user?.fullName?.split(' ')[0] || item?.user?.username)
	}

	function handleShowActionModal(type) {
        setShowActionModal(true);
        setAction(type);
    }

	useEffect(function() {
		async function handleFetchUserTransaction() {
			try {
				setIsLoadingDoc(true)
				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/${selectedTransactionId}/${selectedTransactionUserId}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});

				if(!res.ok) throw new Error('Something went wrong!');
				const data = await res.json();
				setUserTransaction(data?.data?.transaction)
	
			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
				setIsLoadingDoc(false)
			}
		}

		if (showModal) {
			handleFetchUserTransaction()
		}
	} , [showModal]);


	useEffect(function() {
		async function fetchTransactions() {
			try {
				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});

				if(!res.ok) {
					throw new Error('Something went wrong!');
				}

				const data = await res.json();
				if(data?.status !== "success") {
					throw new Error(data?.message);
				}

				setTransactions(data?.data?.transactions);
				console.log(data?.data?.transactions)

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
					<div className="table-flex table-image-user" style={{ wordWrap: 'break-word'}}>
						<img src={row?.user?.image ? `${import.meta.env.VITE_SERVER_ASSET_URL}/users/${row?.user?.image}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row?.user?.fullName.split(' ')[0]} />
						<p>{row?.user?.fullName?.split(' ')[0]}</p>
					</div>
				);
			},
		},
		{
			name: "Purpose",
			selector: (row) => row?.purpose,
		},
		{
			name: "Amount",
			selector: (row) => `₦${numberFormatter(row?.amount)}`,
		},
		{
			name: "Status",
			selector: (row) => (
				<span className={`status status--${row?.status === 'pending' ? "pending" : row?.status === 'success' ? 'success' : 'rejected' }`}>
                    <p>{row?.status === 'pending' ? "Pending" : row?.status === 'success' ? 'Success' : 'Unsuccessful' }</p>
                </span>
			),
		},
		{
			name: "Refrence",
			selector: (row) => row?.reference,
		},
		{
			name: "Paid At",
			selector: (row) => dateConverter(row?.createdAt),
		},
		{
            selector: row => <button className='action--btn action--btn-view' onClick={() => handleTransactionModal(row)}>View</button>
        }
	];


    return (
		<>

			<div className="chart-container">
				<span className="sub_heading">Transaction Chart.</span>
                    <ChartComponent transactions={transactionObj} />
			</div>

			<div className="dashboard_bottom">
					<div className="dashboard_top">
						<span className="sub_heading">All Transaction</span>
						<div className="dashboard-filter_tabs">
							<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
							<span className={`dashboard_tab ${filterTab === 'deposits' ? 'active' : ''}`} onClick={() => setFilterTab('deposits')}>Deposit</span>
							<span className={`dashboard_tab ${filterTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setFilterTab('withdrawals')}>Withdrawal</span>
							<span className={`dashboard_tab ${filterTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setFilterTab('subscriptions')}>Subscription</span>
							<span className={`dashboard_tab ${filterTab === 'giftings' ? 'active' : ''}`} onClick={() => setFilterTab('giftings')}>Giftings</span>
							<span className={`dashboard_tab ${filterTab === 'wishes' ? 'active' : ''}`} onClick={() => setFilterTab('wishes')}>Wishes</span>
							<span className={`dashboard_tab ${filterTab === 'orders' ? 'active' : ''}`} onClick={() => setFilterTab('orders')}>Orders</span>
							<span className={`dashboard_tab ${filterTab === 'redeemed' ? 'active' : ''}`} onClick={() => setFilterTab('redeemed')}>Redeemed</span>
						</div>
					</div>

					<DataTable
						data={filterTab === 'all' ? transactions : filterTab === 'deposits' ? deposits : filterTab === 'withdrawals' ? withdrawals : filterTab === 'subscriptions' ? subscriptions : filterTab === 'giftings' ? giftings : filterTab === 'orders' ? orders : filterTab === 'redeemed' ? redeemed : filterTab === 'wishes' ? wishes : ''}
						columns={columns}
						pagination
						customStyles={customStyles}
						highlightOnHover
						persistTableHead
						progressPending={isLoading}
						progressComponent={<Spinner />}
						noDataComponent={<Message />}
					/>
			</div>


			{(showModal && selectedTransactionId) && (
                    <DashboardModal setShowDashboardModal={setShowModal} SetItemId={setSelectedTransactionId} title={`${capitalizeFirstLetter(seletedUserName)}'s ${capitalizeFirstLetter(seletedTransactionType)} Transaction`}>
                        <div className='modal--content'>
                            {isLoadingDoc && (
                                <MiniSpinner />
                            )}

							{(!isLoadingDoc && useTransition) && (
								<div className='content-top'>
									<img src={userTransaction?.user?.image ? `${import.meta.env.VITE_SERVER_ASSET_URL}/users/${userTransaction?.user?.image}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={userTransaction?.user?.username} className='content-img' />

									<span className='content-details'>
										<div className="details-left">
											<p className='content-name'>{userTransaction?.user?.fullName || userTransaction?.user?.username}</p>
											<span>
												<p>Email: </p>
												<p>{userTransaction?.user?.email}</p>
											</span>
											<span>
												<p>Reference Id: </p>
												<p>{userTransaction?.reference}</p>
											</span>
											<span>
												<p>Status: </p>
												<span className={`status status--${userTransaction?.status === 'pending' ? "pending" : userTransaction?.status === 'success' ? 'success' : 'failed' }`}>
													<p>{userTransaction?.status === 'pending' ? "Pending" : userTransaction?.status === 'success' ? 'Success' : 'Unsuccessful' }</p>
												</span>
											</span>
											<span>
												<p>Amount: </p>
												<p>₦{currencyConverter(userTransaction?.amount)}</p>
											</span>
											<span>
												<p>Purpose: </p>
												<p>{userTransaction?.purpose}</p>
											</span>
										</div>
									</span>
								</div>
							)}
                        </div>

                        {(!isLoadingDoc && (seletedTransactionType === 'withdrawal')) && (
                            <div className={`modal--action action--flex ${seletedTransactionType !== 'withdrawal' ? 'action-not-shown' : ''}`} style={{ marginTop: '1.2rem' }}>
                                <button className='action--btn action--btn-reject' onClick={() => handleShowActionModal('decline')}>Decline {capitalizeFirstLetter(action)}</button>
                                <button className='action--btn action--btn-accept' onClick={() => handleShowActionModal('approve')}>Approve {capitalizeFirstLetter(action)}</button>
                            </div>
                        )}
                    </DashboardModal>
			)}


			{showActionModal && (
				<DashboardModal customStyle={customStyleModal} title={`${capitalizeFirstLetter(action)} this Withdrawal`} setShowDashboardModal={setShowActionModal} overLayZIndex={true} >
					<p className='modal--text'>Are you sure you want to {action} this Withdrawal?</p>
					<div className="form__item">
						<input type="password" id="password" className="form__input" placeholder='Confirm Your Password' value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />

						{action === 'decline' && (
							<textarea className='form__input' placeholder='Give a Reason' value={reasonMessage} onChange={(e) => setReasonMessage(e.target.value)}></textarea>
						)}
					</div>
					<div className="sm-modal--actions" style={{ marginTop: '1.4rem' }}>
						<button type='button' className='cancel--btn' onClick={() => setShowActionModal(false)}>Cancel</button>
						<button type='submit' className='approve--btn' onClick={''}>{capitalizeFirstLetter(action)} Withdrawal</button>
					</div>
				</DashboardModal>
			)}

			{(isError || isSuccess) && (
                <Alert alertType={`${isSuccess ? "success" : "error"}`} message={message} />
            )}
		</>
	);
}

export default TransactionTable;