import React from 'react';
import { MDBCol } from 'mdbreact';
import 'firebase/firestore';

export default () => {
    return (

        <MDBCol sm='12' >
            <div className='alt_div'>
                <div className='mx-auto pl-0 text-center'>
                    <div className='msg pb-5 px-5'><h4>Search here for videos on</h4> </div>
                    <div style={{ marginTop: '1em' }}></div>
                    <div><img src={process.env.PUBLIC_URL + '/mytubelogo.png'} className='img-fluid px-5' alt='logo' width='60%'></img></div>
                    <div style={{ paddingTop: '8em' }} className='px-4'><h6>Note: If you have an Apple phone or device this search will only work if you have iOS 10 or above.</h6></div>

                </div>
            </div>
        </MDBCol>

    )
}