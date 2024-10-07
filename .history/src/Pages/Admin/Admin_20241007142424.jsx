import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './src/App.css';
import Cards from './Pages/Admin/edit/CardsEdit';
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
