
import './App.css'

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Pages/Home/Home';
import User from './Pages/User/User';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userId" element={<User />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;


