import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Admin.module.scss';
import Cards from './src/Pages/Admin/edit/CardsEdit.jsx';
import Modal from './Pages/Admin/edit/ModalsEdit';
import Audio from './Pages/Admin/edit/AudioManagement';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function App() {
  return (
    <Router>
      <Routes> 
        <Route path='cards' element={<Cards />} />
        <Route path='modal' element={<Modal />} /> {/* New route for displaying the card */}
        <Route path='audio' element={<Audio />} /> {/* New route for displaying the card */}

      </Routes>
    </Router>
  );
}

export default App;
