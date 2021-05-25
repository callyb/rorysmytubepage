import React from 'react';
import { MDBCol } from 'mdbreact';
import 'firebase/firestore';

export default () => {
    return (

        <MDBCol sm='12' >
            <div className='alt_div'>
                <div className='mx-auto pl-0 text-center'>
                    <div className='msg'>Search for anything you want on </div>
                    <div style={{ marginTop: '1em' }}></div>
                    <div><img src={process.env.PUBLIC_URL + '/mytubelogo.png'} className='img-fluid  pageLogo px-5' alt='logo' width='60%'></img></div>
                    <div className='msg2'>or go straight to the videos with the button on the searchbar! </div>
                    <div style={{ paddingTop: '4em' }} className='px-4'><h6>Note: If you have an Apple phone or device this search will only work if you have iOS 10 or above.</h6></div>

                </div>
            </div>
        </MDBCol>

    )
}