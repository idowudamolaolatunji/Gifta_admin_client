import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { dateConverter, mdyConvertDate, truncate } from '../../../utils/helper'
import Spinner from '../../../components/Spinner';
import DashboardModal from '../../../components/DashboardModal';
import MiniSpinner from '../../../components/MiniSpinner';
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

function KycTable() {
    const [kycs, setKycs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDoc, setIsLoadingDoc] = useState(true);
    const [filterTab, setFilterTab] = useState('all');

    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [seletedName, setSelectedName] = useState('');
    const [userKyc, setUserKyc] = useState({});

    const [modalTab, setModalTab] = useState('details');

    const { user, token } = useAuthContext();


    function handleKycModal(item) {
        setShowModal(true);
        setSelectedId(item?._id);
        setSelectedName(item?.user?.fullName || item?.user?.username)
    }

    useEffect(function () {
        if (!showModal) {
            setSelectedId(null);
            setSelectedName('');
            setUserKyc(null)
        }
    }, [showModal])

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
            fetchUserKycDetail()
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
                    }
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
    }, [])


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
            name: 'Actions',
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
        <div className='dashboard_container'>
            <div className="dashboard_top">
                <span className="heading__text">Users Kyc</span>
                <div className="dashboard-filter_tabs">
                    {/* <span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span> */}
                    <span className={`dashboard_tab active`} onClick={() => setFilterTab('all')}>All</span>
                    <span className={`dashboard_tab`} onClick={() => setFilterTab('verified')}>Verifed Users</span>
                    <span className={`dashboard_tab`} onClick={() => setFilterTab('premium')}>Preium Users</span>
                    <span className={`dashboard_tab`} onClick={() => setFilterTab('vendors')}>Vendors</span>
                </div>
            </div>

            <DataTable
                // data={filterTab === "all" ? users : filterTab === "verified" ? verifiedUsers : filterTab === "premium" ? premiumUsers : filterTab === "vendors" ? vendors : ''}
                data={kycs}
                columns={columns}
                pagination
                customStyles={customStyles}
                highlightOnHover
                persistTableHead
                progressPending={isLoading}
                progressComponent={<Spinner />}
                paginationPerPage={20}
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
                            <div>
                                <div className="">
                                    <>
                                        <p></p>
                                        <span>
                                            <img src="" alt="" />
                                        </span>
                                    </>
                                </div>
                                <div className="">
                                    <>
                                        <p></p>
                                        <span>
                                            <img src="" alt="" />
                                        </span>
                                    </>
                                </div>

                                <div className="">
                                    <>
                                        <p></p>
                                        <span>
                                        </span>
                                    </>
                                </div>
                                <div className="">
                                    <>
                                        <p></p>
                                        <span>
                                        </span>
                                    </>
                                </div>

                            </div>

                        )}
                    </div>

                    {!isLoadingDoc && (
                        <div className={`modal--action action--flex ${userKyc?.status !== 'pending' ? 'action-not-shown' : ''}`}>
                            <button className='action--btn action--btn-reject'>Reject</button>
                            <button className='action--btn action--btn-accept'>Accept</button>
                        </div>
                    )}
                </DashboardModal>
            )}


        </div>
    );
}

export default KycTable;
