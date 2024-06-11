import React, { useState } from 'react'
import MainDashboard from './components/MainDashboard';
import DashboardComponent from '../../UI/DashboardComponent'
import Spinner from '../../components/Spinner';

function index() {
    const [mainLoader, setMainLoader] = useState(false);

    return (
        <>
            {mainLoader && (
                <div className="overlay">
                    <Spinner />
                </div>
            )}

            <DashboardComponent>
                <MainDashboard setMainLoader={setMainLoader} />
            </DashboardComponent>
        </>
    )
}

export default index
