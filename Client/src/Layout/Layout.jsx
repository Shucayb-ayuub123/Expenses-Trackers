import React from 'react'
import Sidebar from '../components/Sidebar'

const Layout = ({children}) => {
  return (
    <div>
        <Sidebar />

        <main style={{ marginLeft: "250px" }}>
            {children}
        </main>
    </div>
  )
}

export default Layout