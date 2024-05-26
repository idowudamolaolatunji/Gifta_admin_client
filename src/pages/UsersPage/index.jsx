import React from 'react'
import DashboardComponent from '../../UI/DashboardComponent'
import UsersTable from './components/UsersTable'

function index() {
  return (
    <DashboardComponent>
        <UsersTable />
    </DashboardComponent>
  )
}

export default index
