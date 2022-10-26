import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useUsers } from './contexts/UserProvider'
import { useEffect } from 'react'


function App() {
  const { isLoggedIn } = useUsers()

  return (
          <Router>
            <Routes>
              <Route path='/' element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              } exact />
              <Route path='/login/' element={<LoginScreen />}/>
              <Route path='/register/' element={<RegisterScreen />}/>
            </Routes>
          </Router>      
  );
}

export default App;
