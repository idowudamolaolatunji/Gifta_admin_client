import React, { useState } from 'react'
import MainDashboard from './components/MainDashboard';
import DashboardComponent from '../../UI/DashboardComponent'
import Spinner from '../../components/Spinner';

function index() {

    return (
        <DashboardComponent>
            <MainDashboard />
        </DashboardComponent>

    )
}

export default index
