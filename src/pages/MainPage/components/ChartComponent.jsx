import React from "react";

import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";

function ChartComponent({ transactions }) {
	// console.log(transactions)
	const { deposits, withdrawals, subscriptions, giftings, wishes, orders, redeemed } = transactions
	const data = [
		{
			name: "Deposits",
			// pending: 400,
			// amt: 2400,
			Transactions: deposits?.length,
		},
		{
			name: "Gifting",
			// pending: 278,
			// amt: 2000,
			Transactions: giftings?.length,
		},
		{
			name: "Order",
			// pending: 278,
			// amt: 2000,
			Transactions: orders?.length,
		},
		{
			name: "Redeemed",
			// pending: 278,
			// amt: 2000,
			Transactions: redeemed?.length,
		},
		{
			name: "Subscription",
			// pending: 200,
			// amt: 2290,
			Transactions: subscriptions?.length,
		},
		{
			name: "Withdrawal",
			// pending: 300,
			// amt: 2210,
			Transactions: withdrawals?.length,
		},
		{
			name: "Wishes",
			// pending: 200,
			// amt: 2290,
			Transactions: wishes?.length,
		},
	];

	return (
		<AreaChart
			width={870}
			height={380}
			data={data}
			margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Area type="monotone" dataKey="Transactions" stroke="#BB0505" fill= "#FED7D7" />
			{/* <Area type="monotone" dataKey="pending" stroke="#82ca9d"  stroke="#8884d8"/> */}
		</AreaChart>
	);
}

export default ChartComponent;
