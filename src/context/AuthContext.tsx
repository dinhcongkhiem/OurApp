import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../Global'
const API_URL = global.host_auth;

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;

}

const AuthContext = createContext<AuthProps>({
    authState: { token: null, authenticated: null },
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null,
    });

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('accessToken')
            
            if(token){
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        }
        getToken();
    }, [])

    const onLogin = async (email: string, password: string) => {
        try {
            console.log("line 48 of AuthContext : ", `${API_URL}/login`);
            
            const result = await axios.post(`${API_URL}/login`, { email, password });
                
                await AsyncStorage.setItem('accessToken', result.data.accessToken)

             
            setAuthState({
                token: result.data.accessToken,
                authenticated: true
            });


            return result;
        } catch (e) {
            // Set authState to an object even in case of error
            setAuthState({
                token: null,
                authenticated: false
            });
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const onLogout = async () => {
        await AsyncStorage.removeItem('accessToken')
        setAuthState({
            token: null,
            authenticated: false
        });


    };

    return (
        <AuthContext.Provider value={{ authState, onLogin,onLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
