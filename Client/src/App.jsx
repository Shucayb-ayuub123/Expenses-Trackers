import React from 'react'
import Singup from './components/signup'
import { Route, Routes } from "react-router-dom"
import Login from './components/login'
import Verify from './components/verify'

import { ToastContainer, toast } from 'react-toastify';

import Layout from './Layout/Layout'
import Dashboard from "./pages/Dashboard"
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Categories from './pages/Categories'
import Protect from './components/Protect'
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path='/signup' element={<Singup />} />
        <Route path='/Login' element={<Login />} />

        <Route path='/verify-email' element={<Verify />} />


        <Route element={
          <Protect>
            <Layout />
          </Protect>
        }>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path="/Transactions" element={<Transactions />}></Route>
          <Route path='/Reports' element={<Reports />}></Route>
          <Route path='/Categories' element={<Categories />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App