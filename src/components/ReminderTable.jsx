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

function ReminderTable() {
	const [filterTab, setFilterTab] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [reminders, setReminders] = useState([]);

	const events = reminders?.filter(reminder => reminder.category === 'events')
	const anniversary = reminders?.filter(reminder => reminder.category === 'anniversary')
	const birthday = reminders?.filter(reminder => reminder.category === 'birthday')
	const wedding = reminders?.filter(reminder => reminder.category === 'wedding')	

	useEffect(function() {
		async function fetchReminders() {
			try {
				setIsLoading(true);

				const res = await fetch('https://blue-breakable-elephant.cyclic.app/api/reminders/every-reminder', {
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

				setReminders(data.data.reminders);
			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchReminders();
 	}, []);
      
	const columns = [
		{
			name: "User Details",
			selector: (row) => {
                return (
                    <div className='table-flex table-image-user'>
                    {/* <img src={row.user.image} alt={row.user.username} /> */}
                    {/* <p>{row.user.username}</p> */}
                  </div>
                )
            },
		},
		{
			name: "Reminder Title",
			selector: (row) => row.title,
		},
		{
			name: "Category",
			selector: (row) => row.category,
		},
		{
			name: "Added Gifts",
			selector: (row) => row.giftID.length,
		},
		{
			name: "Reminder Date",
			selector: (row) => dateConverter(row.reminderDate),
			// fix this reminder date later
		},
		{
			name: "Created At",
			selector: (row) => dateConverter(row.createdAt),
		},
	];

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<span className="heading__text">Reminders</span>
				<div className="dashboard-filter_tabs">
					<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
					<span className={`dashboard_tab ${filterTab === 'events' ? 'active' : ''}`} onClick={() => setFilterTab('events')}>Events</span>
					<span className={`dashboard_tab ${filterTab === 'anniversarys' ? 'active' : ''}`} onClick={() => setFilterTab('anniversarys')}>Anniversary</span>
					<span className={`dashboard_tab ${filterTab === 'weddings' ? 'active' : ''}`} onClick={() => setFilterTab('weddings')}>Wedding</span>
					<span className={`dashboard_tab ${filterTab === 'birthdays' ? 'active' : ''}`} onClick={() => setFilterTab('birthdays')}>Birthday</span>
				</div>
			</div>

			<DataTable
				data={filterTab === 'all' ? reminders : filterTab === 'events' ? events : filterTab === 'anniversarys' ? anniversary : filterTab === 'birthdays' ? birthday : filterTab === 'weddings' ? wedding : ''}
				columns={columns}
				pagination
				customStyles={customStyles}
				highlightOnHover
				persistTableHead
				progressPending={isLoading}
				progressComponent={<Spinner />}
			/>
		</div>
	);
}

export default ReminderTable;
