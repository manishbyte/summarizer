import React, { createContext, useReducer } from 'react';

// Initial State
const initialState = {
    user: null,
    isAuthenticated: false,
};

// Reducer Function
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false };
        case 'SET_PROFILE':
            return { ...state, user: action.payload, isAuthenticated: true };
        default:
            return state;
    }
};

// Create Context
const AuthContext = createContext();

// Context Provider
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // API Base URL
    const API_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/api/auth`;

    // Action Functions
    const signupUser = async (data) => {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Send cookies
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: result });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    const loginUser = async (data) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: result });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logoutUser = async () => {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                dispatch({ type: 'LOGOUT' });
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const result = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_PROFILE', payload: result });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signupUser,
                loginUser,
                logoutUser,
                fetchProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
