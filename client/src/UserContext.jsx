import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import {data} from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    // to get login state
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);  // to determine when useEffect has fetched user data

    useEffect(() => {
        if (!user) {    // if user is empty, we can try to fetch info about it
            axios.get('/profile').then(({data}) => {
                setUser(data);
                setReady(true);
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}  
        </UserContext.Provider>
    );
}