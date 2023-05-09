import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoGallery from "../PhotoGallery";

function SinglebookingPage() {
    const {id} = useParams()
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({_id}) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }
            });
        }
    }, [id]);

    // if we are loading, do not show anything
    if (!booking) {
        return '';
    }

    return (
        <div className="px-4 lg:px-10 mx-auto my-8 max-w-5xl">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <a className="flex gap-1 my-3 block font-semibold underline" target='_blank' href={'https://maps.google.com/?q=' + booking.place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {booking.place.address}
            </a>

            {/* booking info */}
            <div className="bg-gray-200 p-6 my-4 rounded-2xl">
                <h2 className="text-2xl">Your booking is confirmed!</h2>
                <div className="flex justify-between gap-2 border-t border-gray-300 mt-2 py-1">
                    <div className="flex gap-2 mt-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                        {format(new Date(booking.checkIn), 'dd-MM-yyyy')} &rarr; {format(new Date(booking.checkOut), 'dd-MM-yyyy')}
                    </div>
                    <div className="bg-primary p-1 text-white rounded-2xl mt-2">
                        Total Price: 
                        <span className="text-2xl"> <b>&#8377;{booking.price.toLocaleString({}, {useGrouping:true})}</b></span>
                    </div>
                </div>
            </div>

            <PhotoGallery place={booking.place}/>
        </div>
    );
}

export default SinglebookingPage;