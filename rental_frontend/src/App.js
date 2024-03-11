import logo from './logo.svg';
import './App.css';

import {Link, Routes, Route, Router, BrowserRouter} from 'react-router-dom'
import HomePage from './HomePage';
import Header from './Header';
import InsertProperty from './InsertProperty';


function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Header />

     <Routes>
     <Route path="/" element={<HomePage />}/>
     <Route path="/insert" element={<InsertProperty />}/>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
