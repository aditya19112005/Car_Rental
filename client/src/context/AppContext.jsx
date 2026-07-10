import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [cars, setCars] = useState([]);

  // Fetch logged-in user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/user/data');
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      } else {
        // ✅ Don't navigate, just clear user
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      console.log("fetchUser error:", error.message);
      setUser(null);
    }
  };

  // Fetch all available cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/user/cars');
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/review/get-review');
      data.success ? setReviews(data.review) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common['Authorization'] = '';
    toast.success('You have been logged out');
  };

  // Load token from localStorage on first render
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
    fetchCars();
  }, []);

  // When token changes, set Authorization header and fetch user
  useEffect(() => {
    if (token) {
      
      axios.defaults.headers.common['Authorization'] = token;
      fetchUser();
    } else {
      axios.defaults.headers.common['Authorization'] = '';
      setUser(null);
      setIsOwner(false);
    }
  }, [token]);

  const value = {
    navigate, currency, axios, user, setUser, token, setToken,
    isOwner, setIsOwner, fetchUser, setShowLogin, showLogin,
    logout, fetchCars, cars, setCars, pickupDate, setPickupDate,
    returnDate, setReturnDate, reviews, setReviews,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};