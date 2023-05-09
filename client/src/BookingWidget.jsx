import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

function BookingWidget ({place}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const {user} = useContext(UserContext);

    // to fill the name of logged in user in the booking form
    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookPlace() {
        const data = {
            place: place._id, 
            checkIn, 
            checkOut, 
            numberOfGuests, 
            name, 
            phone, 
            price: numberOfNights * place.price,
        };
        const response = await axios.post('/bookings', data);
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="mt-8 bg-white shadow p-4 rounded-2xl">
            <div className="text-xl text-center"><b>Price:</b> &#8377;{place.price} per night</div>
                <div className="border rounded-2xl mt-4">
                    <div className="flex">
                        <div className="py-3 px-4">
                            <label>Check in: </label>
                            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
                        </div>
                        <div className="py-3 px-4 border-l">
                            <label>Check out: </label>
                            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}/>
                        </div>
                    </div>
                    <div className="py-3 px-4 border-t">
                        <label>Number of guests: </label>
                        <input type="number" value={numberOfGuests} onChange={e => setNumberOfGuests(e.target.value)}/>
                    </div>
                    {numberOfNights > 0 && (
                        <div className="py-3 px-4 border-t">
                            <label>Your Full Name: </label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                            <label>Phone Number: </label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}/>
                        </div>
                    )}
                </div>
            <button onClick={bookPlace} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && (
                    <span> for &#8377;{numberOfNights * place.price}</span>
                )}
                </button>
        </div>
    );
}

export default BookingWidget;