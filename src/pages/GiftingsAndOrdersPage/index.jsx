import React from 'react'
import DashboardComponent from '../../UI/DashboardComponent'
import GiftAndOrderComponent from './components/GiftingAndOrderTable'

function index() {
  return (
    <DashboardComponent>
        <GiftAndOrderComponent />
    </DashboardComponent>
  )
}

export default index
