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

function ProductTable() {
	const [filterTab, setFilterTab] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [giftProducts, setGiftProducts] = useState([]);

	const arts = giftProducts?.filter(product => product.category === 'arts')
	const birthday = giftProducts?.filter(product => product.category === 'birthday')	
	const anniversary = giftProducts?.filter(product => product.category === 'anniversary')
	const hamper = giftProducts?.filter(product => product.category === 'hamper')
	const giftcards = giftProducts?.filter(product => product.category === 'giftcard')
	const custom = giftProducts?.filter(product => product.category === 'custom')	

	useEffect(function() {
		async function fetchGiftProducts() {
			try {
				setIsLoading(true);

				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/gift-products/products`, {
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

				setGiftProducts(data.data.giftProducts);
			} catch(err) {
				console.log(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchGiftProducts();
 	}, []);

	const columns = [
		{
			name: "Product Name",
			selector: (row) => {
				return (
					<div className="table-flex table-product">
						<img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${row?.images[0]}`} alt={row.name} />
						<p>{truncate(row?.name, 22)}</p>
					</div>
				);
			},
			width: '250px'
			
		},
		{
			name: "Price",
			selector: (row) => `₦${numberFormatter(row.price)}`,
		},
		{
			name: "Category",
			selector: (row) => row.category,
		},
		{
			name: "Product Vendor",
			selector: row => {
                return (
                    <div className='table-flex table-image-user'>
                        <img src={row?.vendor?.image ? `${import.meta.env.VITE_SERVER_ASSET_URL}/users/${row?.vendor?.image}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={row.fullName || row.username} />
                        <p>{truncate(row?.vendor?.fullName, 20)}</p>
                    </div>
                )
            },
			width: '250px'
		},
		{
			name: "Uploaded At",
			selector: (row) => dateConverter(row.createdAt),
		},
	];

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<span className="heading__text">All Products</span>
				<div className="dashboard-filter_tabs">
					<span className={`dashboard_tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</span>
					<span className={`dashboard_tab ${filterTab === 'arts' ? 'active' : ''}`} onClick={() => setFilterTab('arts')}>Arts</span>
					<span className={`dashboard_tab ${filterTab === 'birthdays' ? 'active' : ''}`} onClick={() => setFilterTab('birthdays')}>Birthday</span>
					<span className={`dashboard_tab ${filterTab === 'anniversarys' ? 'active' : ''}`} onClick={() => setFilterTab('anniversarys')}>Anniversary</span>
					<span className={`dashboard_tab ${filterTab === 'hamper' ? 'active' : ''}`} onClick={() => setFilterTab('hamper')}>Hamper</span>
					<span className={`dashboard_tab ${filterTab === 'giftcards' ? 'active' : ''}`} onClick={() => setFilterTab('giftcards')}>GiftCard</span>
					<span className={`dashboard_tab ${filterTab === 'custom' ? 'active' : ''}`} onClick={() => setFilterTab('custom')}>Custom</span>
				</div>
			</div>

			<DataTable
				data={filterTab === 'all' ? giftProducts : filterTab === 'arts' ? arts : filterTab === 'birthdays' ? birthday : filterTab === 'anniversarys' ? anniversary : filterTab === 'hamper' ? hamper : filterTab === 'giftcards' ? giftcards : filterTab === 'custom' ? custom : ''}
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

export default ProductTable;
