import {Link} from 'react-router-dom';
import AccountNav from '../AccountNav';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from '../Image';

function PlacesPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/user-places').then(({data}) => {
            setPlaces(data);
        });
    }, []);
    return (
        <div>
            <AccountNav />
            <div className='text-center'>
                <br />
                <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className='mt-4 px-4 lg:px-60'>
                {places.length > 0 && places.map(place => (
                    <Link to={'/account/places/' + place._id} className='mb-4 flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-xl' key={place._id}>
                        <div className='flex w-32 h-32 bg-gray-300 shrink-0'>
                            {place.photos.length && (
                                <Image className='object-cover' src={place.photos[0]} alt="" />
                            )}
                        </div>
                        <div>
                            <h2 className='text-xl'>{place.title}</h2>
                            <p className='text-sm mt-2'>{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default PlacesPage;