import React from 'react'
import DashboardComponent from '../../UI/DashboardComponent'
import CategoryComponent from './components/CategoryComponent'

function index() {
  return (
    <DashboardComponent>
      <CategoryComponent />
    </DashboardComponent>
  )
}

export default index
