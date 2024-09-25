import React, { useState } from "react"
import ThreeCanvas from "./Pages/Users/ThreeCanvas";
import Admin from "./Pages/Admin/Admin";
import { Routes, Route } from 'react-router-dom';



const App = () => {

  // Modal utils
  return ( 
    <Routes>
        <Route path="/" element={<ThreeCanvas />} />
        <Route path="/admin" element={<Admin />} />
        {/* Redirect on main page */}
        <Route path="*" element={<ThreeCanvas />} />
    </Routes>
   );
}
 
export default App;