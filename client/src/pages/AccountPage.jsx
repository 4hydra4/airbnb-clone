import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

function ProfilePage() {
    const [redirect, setRedirect] = useState(null);     // this will be used for redirecting user to homepage after logging out
    const {ready, user, setUser} = useContext(UserContext);
    // to get the current page we are on
    let {subpage} = useParams();
    if (subpage === undefined) {        // since for '/account/profile', subpage = undefined
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout')
        setRedirect('/');
        setUser(null);
    }

    if (!ready) {
        return 'Loading...';
    }

    // if we are not logged in, account page should not be visible
    // also check if there isn't any other redirect
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }
    
    

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
            {/* navigation bar */}
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    );
}

export default ProfilePage;