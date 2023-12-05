import React from "react";

import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";

function ChartComponent({ deposits, withdrawals, subscriptions, giftings }) {
	const data = [
		{
			name: "Withdrawal",
			// pending: 300,
			// amt: 2210,
			Transactions: withdrawals,
		},
		{
			name: "Deposits",
			// pending: 400,
			// amt: 2400,
			Transactions: deposits,
		},
		{
			name: "Subscription",
			// pending: 200,
			// amt: 2290,
			Transactions: subscriptions,
		},
		{
			name: "Gifting",
			// pending: 278,
			// amt: 2000,
			Transactions: giftings,
		},
	];

	return (
		<AreaChart
			width={850}
			height={320}
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
