import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { dateConverter, truncate } from '../../../utils/helper.js';
import Spinner from '../../../components/Spinner.jsx';


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
};

function UsersTable() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterTab, setFilterTab] = useState('all');

    const verifiedUsers = users?.filter(user => user.isKycVerified === true);
    const premiumUsers = users?.filter(user => user.isPremium === true);
    const vendors = users?.filter(user => user.role === 'vendor');


    useEffect(function () {
        async function fetchUsers() {
            try {
                setIsLoading(true)
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
                    method: 'GET',
                    headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
                });

                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }

                const data = await res.json();
                console.log(data);

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }

                setUsers(data.data.users)

            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers();
    }, [])


    const columns = [
        {
            name: 'Username',
            selector: row => {
                return (
                    <div className='table-flex table-image-user'>
                        <img src={row?.image ? `${import.meta.env.VITE_SERVER_ASSET_URL}/users/${row?.image}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row.fullName || row.username} />
                        <p>{truncate(row?.username, 15)}</p>
                    </div>
                )
            },
			width: '185px'
        },
        {
            name: 'Email Address',
            selector: row => row.email,
            width: '190px'
        },
        {
            name: 'Role',
            selector: row => row.role,
            width: '120px'
        },
        {
            name: 'Account Type',
            selector: row => `${row.isPremium === true ? "Permium" : "Free"}`,
            width: '120px'
        },
        {
            name: 'Kyc Verified',
            selector: row => `${row.isKycVerified === true ? "Verified" : "Not Verified"}`,
            width: '120px'
        },
        {
            name: 'Joined At',
            selector: row => dateConverter(row.createdAt),
        },
    ];

    return (
        <div className='dashboard_container'>
            <div className="dashboard_top">
                <span className="heading__text">All Users</span>
                <div className="dashboard-filter_tabs">
                    <span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
                    <span className={`dashboard_tab ${filterTab === 'verified' ? 'active' : ''}`} onClick={() => setFilterTab('verified')}>Verifed Users</span>
                    <span className={`dashboard_tab ${filterTab === 'premium' ? 'active' : ''}`} onClick={() => setFilterTab('premium')}>Preium Users</span>
                    <span className={`dashboard_tab ${filterTab === 'vendors' ? 'active' : ''}`} onClick={() => setFilterTab('vendors')}>Vendors</span>
                </div>
            </div>

            <DataTable
                data={filterTab === "all" ? users : filterTab === "verified" ? verifiedUsers : filterTab === "premium" ? premiumUsers : filterTab === "vendors" ? vendors : ''}
                columns={columns}
                pagination
                customStyles={customStyles}
                highlightOnHover
                persistTableHead
                progressPending={isLoading}
                progressComponent={<Spinner />}
                paginationPerPage={25}
            />


        </div>
    );
}

export default UsersTable;
