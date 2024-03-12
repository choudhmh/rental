import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'

import './navbar.css'

function Header() {
  const [openBasic, setOpenBasic] = useState(false);

  return (
    <nav className="navbar">
    <div className="container">
     
      <div className="nav-elements">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/insert">Insert Property</NavLink>
          </li>
          <li>
            <NavLink to="/display">Display Properties</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default Header