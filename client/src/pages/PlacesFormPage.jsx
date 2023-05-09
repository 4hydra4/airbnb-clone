import { useEffect, useState } from "react";
import Perks from '../Perks';
import PhotosUploader from '../PhotosUploader';
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(500);
    const [redirect, setRedirect] = useState(false);
    
    // to allow editing
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });

    }, [id]);

    // Function for submitting form data
    async function savePlace(e) {
        e.preventDefault();
        const placeData = {id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price};
        if (id) {
            // update
            await axios.put('/places', {id, ...placeData});
        } else {
            // new place
            await axios.post('/places', placeData);
        }
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
        <div className="px-4 lg:px-60">
            <form onSubmit={savePlace}>
                <h2 className='text-xl mt-4'>Title</h2>
                <input type="text" 
                    placeholder='title (for example: My Lovely Apt)'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <h2 className='text-xl mt-4'>Address</h2>
                <input 
                    type="text" 
                    placeholder='address'
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />

                <h2 className='text-xl mt-4'>Photos</h2>
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>

                <h2 className='text-xl mt-6'>Description</h2>
                <textarea value={description} onChange={e => setDescription(e.target.value)}/>

                <h2 className='text-xl mt-4'>Perks</h2>
                <p  className='text-gray-500 text-sm'>Highlight the perks of your place</p>
                <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                    <Perks selected={perks} onChange={setPerks}/>
                </div>

                <h2 className='text-xl mt-6'>Extra Info</h2>
                <p  className='text-gray-500 text-sm'>House rules, etc.</p>
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>

                <h2 className='text-xl mt-4'>Check-in & Check-out</h2>
                <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
                    <div>
                        <h3 className='mt-2 -mb-1'>Check-in time</h3>
                        <input 
                            type="text" 
                            placeholder='hh:mm'
                            value={checkIn}
                            onChange={e => setCheckIn(e.target.value)}
                        />  
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Check-out time</h3>
                        <input 
                            type="text" 
                            placeholder='hh:mm'
                            value={checkOut}
                            onChange={e => setCheckOut(e.target.value)}
                        />  
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Max guests</h3>
                        <input 
                            type="number" 
                            placeholder='1'
                            value={maxGuests}
                            onChange={e => setMaxGuests(e.target.value)}
                        />  
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Price per night</h3>
                        <input 
                            type="number" 
                            placeholder='500'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />  
                    </div>
                </div>
                
                <button className='primary my-4'>Save</button>
            </form>
        </div>
    );
}

export default PlacesFormPage;