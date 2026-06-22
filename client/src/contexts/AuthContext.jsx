import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    loggedIn: false,
    login: async () => {},
    logout: async () => {}
});

export default AuthContext;