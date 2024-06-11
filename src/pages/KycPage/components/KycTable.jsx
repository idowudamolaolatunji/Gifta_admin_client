import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { capitalizeFirstLetter, dateConverter, mdyConvertDate, truncate } from '../../../utils/helper'
import DashboardModal from '../../../components/DashboardModal';
import Alert from '../../../components/Alert';
import MiniSpinner from '../../../components/MiniSpinner';
import Spinner from '../../../components/Spinner';
import MainSpinner from '../../../components/MainSpinner';

import { FaRegStickyNote } from "react-icons/fa";
import { MdOutlineAdsClick } from "react-icons/md";

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { useAuthContext } from '../../../context/AuthContext';

const customStyles = {
    head: {
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#555'
        }
    },
    rows: {
        style: {
            minHeight: '55px',
        }
    },
}

const customStyleModal = {
    minHeight: "auto",
    maxWidth: "44rem",
    width: "44rem",
    zIndex: 300000
};

function KycTable() {
    const [kycs, setKycs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDoc, setIsLoadingDoc] = useState(true);
    const [isLoadingKyc, setIsLoadingKyc] = useState(false);
    const [filterTab, setFilterTab] = useState('all');

    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [seletedName, setSelectedName] = useState('');
    const [userKyc, setUserKyc] = useState(null);

    const [modalTab, setModalTab] = useState('details');
    const [showActionModal, setShowActionModal] = useState(false)
    const [action, setAction] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [reasonMessage, setReasonMessage] = useState('');

    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [refecthHelp, setRefecthHelp] = useState(false);

    const { token } = useAuthContext();


    const all = kycs;
    const approvedKyc = kycs.filter((kyc) => kyc?.user?.isKycVerified && kyc.status === 'approved');
    const pendingKyc = kycs.filter((kyc) => !kyc?.user?.isKycVerified && kyc.status === 'pending');
    const rejectedKyc = kycs.filter((kyc) => !kyc?.user?.isKycVerified && kyc.status === 'rejected');


    function Message() {
        return (<p className="no--message" style={{ margin: '2rem auto' }}>No {filterTab !== 'all' ? filterTab : ''} document</p>) 
    }
    

    function handleKycModal(item) {
        setShowModal(true);
        setSelectedId(item?._id);
        setSelectedName(item?.user?.fullName || item?.user?.username)
    }

    function handleShowActionModal(type) {
        setShowActionModal(true);
        setAction(type)
    }

    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess);
        setTimeout(function () {
            setIsError(false);
            setMessage("");
        }, 2000);
    }


    useEffect(function () {
        if (!showModal) {
            setSelectedId(null);
            setSelectedName('');
            setUserKyc(null)
            setModalTab('details');
        }
        if(!showActionModal) {
            setAdminPassword('');
            setReasonMessage('');
        }
        // setRefecthHelp(false);
    }, [showModal, showActionModal])

    useEffect(function () {

        async function fetchUserKycDetail() {
            try {

                setIsLoadingDoc(true)
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs/${selectedId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(res)
                const data = await res.json();
                console.log(data)
                setUserKyc(data?.data?.kycDoc)

            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoadingDoc(false)
            }
        }

        if (showModal) {
            fetchUserKycDetail();
        }

    }, [showModal]);




    useEffect(function () {
        async function fetchUsersKycs() {
            try {
                setIsLoading(true)
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }

                const data = await res.json();
                console.log(data);

                if (data?.status !== 'success') {
                    throw new Error(data?.message);
                }

                setKycs(data?.data?.kycs)

            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsersKycs();
    }, [refecthHelp]);

    async function handleAcceptKyc() {
        try {
            setIsLoadingKyc(true);
            if(!adminPassword) throw new Error('Confirm Password!');

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs/approve-kyc/${userKyc?.user?._id}/${selectedId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password: adminPassword })
            });


            if (!res.ok) {
                throw new Error((await res.json()).message || 'Something went wrong!');
            }

            const data = await res.json();
            console.log(data);

            if (data?.status !== 'success') {
                throw new Error(data?.message);
            }

            setIsSuccess(true);
            setMessage(data?.message);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage("");
                setShowModal(false);
                setShowActionModal(false);
                setAction('')
                setRefecthHelp(true)
            }, 1800);

        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoadingKyc(false);
            setAdminPassword('')
        }
    }

    async function handleRejectKyc() {
        try {
            setIsLoadingKyc(true);
            if(!adminPassword) throw new Error('Confirm Password!');
            if(!reasonMessage) throw new Error('Give user a reason for rejection');

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs/reject-kyc/${userKyc?.user?._id}/${selectedId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    password: adminPassword,
                    reason: reasonMessage
                })           
            });

            if (!res.ok) {
                throw new Error((await res.json()).message || 'Something went wrong!');
            }

            const data = await res.json();
            console.log(data);
            if(data?.message === 'Incorrect password') {
                setAdminPassword('');
            }

            if (data?.status !== 'success') {
                throw new Error(data?.message);
            }

            setIsSuccess(true);
            setMessage(data?.message);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage("");
                setShowModal(false);
                setShowActionModal(false);
                setAction('');
                setRefecthHelp(true);
            }, 1800);

        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoadingKyc(false);
        }
    }


    const columns = [
        {
            name: 'Username',
            selector: row => {
                return (
                    <div className='table-flex table-image-user'>
                        <img src={row?.user?.image ? `${import.meta.env.VITE_SERVER_ASSET_URL}/users/${row?.user?.image}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row?.user?.fullName || row?.user?.username} />
                        <p>{truncate(row?.user?.fullName, 15)}</p>
                    </div>
                )
            },
            width: '185px'
        },
        {
            name: 'Email Address',
            selector: row => row?.user?.email,
        },
        {
            name: 'Role',
            selector: row => row?.user?.role,
        },
        {
            name: 'Kyc Status',
            selector: row => (
                <span className={`status status--${row?.status === 'pending' ? "pending" : row?.status === 'approved' ? 'approved' : 'rejected'}`}>
                    <p>{row?.status === 'pending' ? "Pending" : row?.status === 'approved' ? 'Approved' : 'Rejected'}</p>
                </span>
            ),

        },
        {
            // name: 'Action',
            selector: row => {
                return (
                    // <div className='action--flex'>
                    //     <button className='action--btn action--btn-reject'>Reject</button>
                    //     <button className='action--btn action--btn-accept'>Accept</button>
                    // </div>
                    <button className='action--btn action--btn-view' onClick={() => handleKycModal(row)}>View Document</button>
                )
            }
        }
    ];

    return (
        <>
            {isLoadingKyc && (
                <MainSpinner />
            )}

            <div className='dashboard_container'>
                <div className="dashboard_top">
                    <span className="heading__text">Users Kyc</span>
                    <div className="dashboard-filter_tabs">
                        {/* <span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span> */}
                        <span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
                        <span className={`dashboard_tab ${filterTab === 'pending' ? 'active' : ''}`} onClick={() => setFilterTab('pending')}>Pending</span>
                        <span className={`dashboard_tab ${filterTab === 'approved' ? 'active' : ''}`} onClick={() => setFilterTab('approved')}>Approved</span>
                        <span className={`dashboard_tab ${filterTab === 'rejected' ? 'active' : ''}`} onClick={() => setFilterTab('rejected')}>Rejected</span>
                    </div>
                </div>

                <DataTable
                    data={filterTab === "all" ? all : filterTab === "rejected" ? rejectedKyc : filterTab === "pending" ? pendingKyc : filterTab === "approved" ? approvedKyc : ''}
                    columns={columns}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    persistTableHead
                    progressPending={isLoading}
                    progressComponent={<Spinner />}
                    paginationPerPage={20}
                    noDataComponent={<Message />}
                />


                {(showModal && selectedId) && (
                    <DashboardModal setShowDashboardModal={setShowModal} SetItemId={setSelectedId} title={`${seletedName}'s KYC Document`}>
                        <div className='modal--tabs'>
                            <span className={`modal--tab ${modalTab === 'details' ? 'active-modal-tab' : ''}`} onClick={() => setModalTab('details')}>User Details</span>
                            <span className={`modal--tab ${modalTab === 'documents' ? 'active-modal-tab' : ''}`} onClick={() => setModalTab('documents')}>Documents</span>
                        </div>


                        <div className='modal--content'>

                            {isLoadingDoc && (
                                <MiniSpinner />
                            )}

                            {(modalTab === 'details' && !isLoadingDoc) && (
                                <>
                                    <div className='content-top'>
                                        <img src={(userKyc?.selfieImage || userKyc?.user?.image) ? `${import.meta.env.VITE_SERVER_ASSET_URL}/${userKyc?.user?.image ? 'users' : 'kycs'}/${userKyc?.user?.image || userKyc?.selfieImage}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={userKyc?.user?.username} className='content-img' />

                                        <span className='content-details'>
                                            <div className="details-left">
                                                <p className='content-name'>{userKyc?.user?.fullName || userKyc?.user?.username}</p>
                                                <span>
                                                    <p>Email: </p>
                                                    <p>{userKyc?.user?.email}</p>
                                                </span>
                                                <span>
                                                    <p>User Role: </p>
                                                    <p>{userKyc?.user?.role}</p>
                                                </span>
                                                <span>
                                                    <p>DOB: </p>
                                                    <p>{mdyConvertDate(userKyc?.dob)}</p>
                                                </span>
                                                <span>
                                                    <p>Address: </p>
                                                    <p>{userKyc?.address}</p>
                                                </span>
                                                <span>
                                                    <p>Phone Number: </p>
                                                    <p>{userKyc?.phoneNumber}</p>
                                                </span>
                                                {userKyc?.cac && (
                                                    <span>
                                                        <p>CAC Number: </p>
                                                        <p>{userKyc?.cac}</p>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="details-positioned">
                                                {(!userKyc?.user?.isKycVerified && userKyc?.status === 'pending') && (
                                                    <span style={{ color: '#ff9248', fontWeight: '500', fontSize: '1.4rem' }}>Waiting For Approval</span>
                                                )}
                                                {(userKyc?.user?.isKycVerified && userKyc?.status === 'approved') && (
                                                    <span style={{ color: '#4e48f0', fontWeight: '500', fontSize: '1.4rem' }}>Approved By Admin</span>
                                                )}
                                                {(!userKyc?.user?.isKycVerified && userKyc?.status === 'rejected') && (
                                                    <span style={{ color: '#ff0000', fontWeight: '500', fontSize: '1.4rem' }}>Document Already Rejected</span>
                                                )}
                                            </div>
                                        </span>
                                    </div>

                                    <div className="details-other" style={{ marginTop: '2rem' }}>
                                        <p className='content-name'>Documnet Info</p>
                                        <span>
                                            <p>Document Type: </p>
                                            <p>{userKyc?.documentType === 'id-card' ? 'National ID Card' : "Driver's License"}</p>
                                        </span>
                                        <span>
                                            <p>Document Number: </p>
                                            <p>{userKyc?.documentNumber}</p>
                                        </span>
                                        <span>
                                            <p>Document Image: </p>
                                            <p>{userKyc?.frontImg && userKyc?.backImg ? '(2) Images' : 'null'}</p>
                                        </span>
                                        <span>
                                            <p>Utility Bill: </p>
                                            <p>{userKyc?.utilityBill ? 'true' : 'false'}</p>
                                        </span>
                                        <span>
                                            <p>Statement Of Account: </p>
                                            <p>{userKyc?.acctStatement ? 'true' : 'false'}</p>
                                        </span>
                                    </div>

                                </>

                            )}


                            {(modalTab === 'documents' && !isLoadingDoc) && (
                                <div className='details-documents'>
                                    <div className="">
                                        <p className='document--label'>ID Card Front Image</p>
                                        <Zoom>
                                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/kycs/${userKyc?.frontImg}`} alt="" />
                                        </Zoom>
                                    </div>
                                    <div className="">
                                        <p className='document--label'>ID Card Back Image</p>
                                        <Zoom>
                                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/kycs/${userKyc?.backImg}`} alt="" />
                                        </Zoom>
                                    </div>

                                    <div className="">
                                        <p className='document--label'>Utility Bill Doxument</p>
                                        <div className='doc-item'>
                                            {!userKyc?.utilityBill ? (
                                                <span className='doc-flex'>
                                                    <FaRegStickyNote />
                                                    <p>No Document</p>
                                                </span>
                                            ) : (
                                                <div>
                                                    {userKyc?.utilityBill.endsWith('.pdf') ? (
                                                        <a href={`${import.meta.env.VITE_SERVER_ASSET_URL}/kycs/${userKyc?.utilityBill}`} className='upload--btn' target='_blank'>View Utility Bill PDF</a>
                                                    ) : (
                                                        <Zoom>
                                                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/kycs/${userKyc?.utilityBill}`} />
                                                        </Zoom>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="">
                                        <p className='document--label'>Statement of Account</p>
                                        <div className='doc-item'>
                                            {!userKyc?.acctStatement ? (
                                                <span className='doc-flex'>
                                                    <FaRegStickyNote />
                                                    <p>No Document</p>
                                                </span>
                                            ) : (
                                                <div>
                                                    {userKyc?.acctStatement.endsWith('.pdf') ? (
                                                        <a href={`${import.meta.env.VITE_SERVER_ASSET_URL}/kycs/${userKyc?.acctStatement}`} target='_blank' className='upload--btn'>View Account Statement PDF</a>
                                                    ) : (
                                                        <Zoom>
                                                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/kycs/${userKyc?.acctStatement}`} target='_blank' className='upload--img' />
                                                        </Zoom>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            )}
                        </div>

                        {!isLoadingDoc && (
                            <div className={`modal--action action--flex ${userKyc?.status !== 'pending' ? 'action-not-shown' : ''}`}>
                                <button className='action--btn action--btn-reject' onClick={() => handleShowActionModal('reject')}>Reject</button>
                                <button className='action--btn action--btn-accept' onClick={() => handleShowActionModal('accept')}>Accept</button>
                            </div>
                        )}
                    </DashboardModal>
                )}



                {showActionModal && (
                    <DashboardModal customStyle={customStyleModal} title={`${capitalizeFirstLetter(action)} this KYC Document`} setShowDashboardModal={setShowActionModal} overLayZIndex={true} >
                        <p className='modal--text'>Are you sure you want to {action} this document?</p>
                        <div className="form__item">
                            <input type="password" id="password" className="form__input" placeholder='Confirm Your Password' value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />

                            {action === 'reject' && (
                                <textarea className='form__input' placeholder='Give a Reason' value={reasonMessage} onChange={(e) => setReasonMessage(e.target.value)}></textarea>
                            )}
                        </div>
                        <div className="sm-modal--actions" style={{ marginTop: '1.4rem' }}>
                            <button type='button' className='cancel--btn' onClick={() => setShowActionModal(false)}>Cancel</button>
                            <button type='submit' className='approve--btn' onClick={action === 'reject' ? handleRejectKyc : handleAcceptKyc}>{capitalizeFirstLetter(action)} KYC</button>
                        </div>
                    </DashboardModal>
                )}


            </div>

            
            {(isError || isSuccess) && (
                <Alert alertType={`${isSuccess ? "success" : "error"}`} message={message} />
            )}

        </>
    );
}

export default KycTable;
