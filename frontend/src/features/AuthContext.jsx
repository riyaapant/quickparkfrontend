import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from './config';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {

        const token = useSelector((state) => state.token)

        const [loading, setLoading] = useState(true);

        const api = axios.create({
            baseURL: config.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${token}`
            },
        });
    const [profile, setProfile] = useState();

    useEffect(() => {
        const fetchUser =  async () => {
            try {
                const response = await api.get(`profile`)
                console.log("auth context response: ", response.data)
                if(response.data.is_owner){
                    setProfile('owner')
                }
                else if(!response.data.is_owner){
                    setProfile('customer')
                }
                if(response.data.is_owner === null){
                    setProfile('admin')
                }
                // console.log("auth context: ", response.data.is_owner)
                // setProfile(response.data.is_owner)
            } catch (e) {
                console.log("error: ", e.response)
            } finally{
                setLoading(false)
            }
        };

        fetchUser();
    }, profile);

    return (
        <ProfileContext.Provider value={{ profile, setProfile, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};


// import axios from 'axios';
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import config from './config';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {

//     const token = useSelector((state) => state.token)

//     const api = axios.create({
//         baseURL: config.BASE_URL,
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + `${token}`
//         },
//     });
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await api.get(`profile`)
//                 console.log("auth context: ", response.data.is_owner)
//                 setUser(response.data)
//             } catch (e) {
//                 console.log("error: ", e.response)
//             }
//         };

//         fetchUser();
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, setUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
