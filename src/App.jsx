import React, { useState } from "react";
import SignInModule from "./Pages/Users/landing/signInModule/SignInModule";
import ThreeCanvas from "./Pages/Users/map/ThreeCanvas";
import Admin from "./Pages/Admin/Admin";
import { Routes, Route } from 'react-router-dom';



const App = () => {

  // Modal utils
  return ( 
    <Routes>
        <Route path="/" element={<SignInModule />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/map" element={<ThreeCanvas />} />
        {/* Redirect on landing page */}
        <Route path="*" element={<SignInModule />} />
    </Routes>
   );
}
 
export default App;