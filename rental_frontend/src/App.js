import logo from './logo.svg';
import './App.css';

import {Link, Routes, Route, Router, BrowserRouter} from 'react-router-dom'
import HomePage from './HomePage';
import Header from './Header';
import InsertProperty from './InsertProperty';
import Display from './Display';
import Update from './Update';


function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Header />

     <Routes>
     <Route path="/" element={<HomePage />}/>
     <Route path="/insert" element={<InsertProperty />}/>
     <Route path="/display" element={<Display />}/>
     <Route path="/update/:id" element={<Update />} />
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
