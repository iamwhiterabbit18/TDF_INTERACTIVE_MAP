import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Cards from './Pages/Admin/edit/CardsEdit';
import Modal from './Pages/Admin/edit/ModalsEdit';
import Audio from './Pages/Admin/edit/AudioManagement';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function App() {
  return (
    <Router>
      <Routes> 
        <Route path='cards' element={<Cards />} />{/* New route for displaying the CardsEdit */}
        <Route path='/modal' element={<Modal />} /> {/* New route for displaying the ModalsEdit */}
        <Route path='audio' element={<Audio />} /> {/* New route for displaying the Audio Management */}

      </Routes>
    </Router>
  );
}

export default App;
