import React from 'react';
import { MDBCol, MDBBtn } from 'mdbreact';
import 'firebase/firestore';

export default () => {
    return (

        <MDBCol sm='12' >
            <div className='alt_div'>
                <div className='mx-auto pl-0 text-center'>
                    <div className='d-flex align-items-center justify-content-center toVidsBtn'>
                        {/* <MDBBtn outline color='primary' id='toVideos' onClick={onsubmit()}>
                            <h4>To Videos</h4>
                        </MDBBtn> */}
                    </div>
                    <div style={{ marginTop: '1em' }}></div>
                    <div><img src={process.env.PUBLIC_URL + '/mytubelogo.png'} className='img-fluid px-5' alt='logo' width='60%'></img></div>
                    <div style={{ paddingTop: '8em' }} className='px-4'><h6>Note: If you have an Apple phone or device this search will only work if you have iOS 10 or above.</h6></div>

                </div>
            </div>
        </MDBCol>

    )
}