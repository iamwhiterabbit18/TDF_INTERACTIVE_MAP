import React, { useState } from "react";
import SignInModule from "./Pages/Users/landing/signInModule/SignInModule";
import ThreeCanvas from "./Pages/Users/map/ThreeCanvas";
//import Admin from "./Pages/Admin/Admin";
import { Routes, Route } from 'react-router-dom';
import Cards from './Pages/Admin/edit/CardsEdit'; //Admin and Staff Only
import Modal from './Pages/Admin/edit/ModalsEdit';  //Admin and Staff Only
import Audio from './Pages/Admin/edit/AudioManagement'; //Admin and Staff Only
import UserManagement from './Pages/Admin/edit/UserManagement'; // Admin Only
import PrivateRoute from  '/src/Pages/Admin/ACMfiles/PrivateRoute'; 
import { AuthProvider } from  '/src/Pages/Admin/ACMfiles/AuthContext';

import PageAnimation from '/src/Pages/PageAnimations';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const App = () => {

  // Modal utils
  return ( 
    <AuthProvider>

    <Routes>
        <Route path="/" element={<SignInModule />} />
        <Route path="/map" element={<ThreeCanvas />} />
        {/* Redirect on landing page */}
        <Route path="*" element={<SignInModule />} />


        <Route path="/usermanage" element={ <PrivateRoute roles={['admin']}><UserManagement/> </PrivateRoute> } />
        <Route path='cards'  element={ <PrivateRoute roles={['admin', 'staff']}><Cards/> </PrivateRoute> } /> 
        <Route path='/modal' element={ <PrivateRoute roles={['admin', 'staff']}><Modal/> </PrivateRoute> } />
        <Route path='audio' element={ <PrivateRoute roles={['admin', 'staff']}><Audio/> </PrivateRoute> } />
    </Routes>
    </AuthProvider>
   );
}
 
export default App;