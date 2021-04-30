import React, { useState, useEffect } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBInput, MDBAlert } from 'mdbreact';
import Spinner from './Spinner';
import firebase from 'firebase/app';
import 'firebase/firestore';
import $ from 'jquery';

export default () => {

    const db = firebase.firestore().collection('users');
    const [values, setValues] = useState(
        {
            fname: '',
            lname: '',
            email: '',
            consent: '',
            parentConsent: '',
            pname: '',
            pEmail: ''
        });
    const [userEmails, setUserEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);
    const [Crequired, setCrequired] = useState('required');
    const [PCrequired, setPCrequired] = useState('required');
    const [Cdisabled, setCdisabled] = useState('');
    const [PCdisabled, setPCdisabled] = useState('');

    const getUserData = (value, type) => {
        setValues({ ...values, [type]: value })
        console.log('data = ', values)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        SaveUser(values)
    }

    useEffect(() => {
        const unsubscribe =
            firebase.firestore().collection('users').onSnapshot((snapshot) => {
                const Emails = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    email: doc.data().email

                }))
                setUserEmails(Emails);
            }, () => {

            }, (error) => { console.log(error.message) }
            )

        return () => unsubscribe();

    }, []);

    const SaveUser = () => {
        console.log('saveItem = ', values, 'Emails = ', userEmails)

        if (
            userEmails.find(user => user.email === values.email)

        ) {
            setAlert(true)
        } else {
            db.add({ 'fname': values.fname, 'lname': values.lname, 'email': values.email, 'consent': values.consent, 'parentConsent': values.parentConsent, 'pname': values.pname, 'pEmail': values.pEmail })
            setLoading(false);
            setSuccess(true);
        }

    };

    const getConsent = e => {
        const checked = e.target.checked;
        if (checked) {
            setValues({ ...values, 'consent': true })
            setPCrequired('');
            setPCdisabled('disabled');
            console.log('data = ', values)
        } else if (!checked) {
            setValues({ ...values, 'consent': false })
            setPCrequired('required');
            setPCdisabled('');
            console.log('data = ', values)
        }
    }

    const getParentConsent = e => {
        const ischecked = e.target.checked
        if (ischecked) {
            setValues({ ...values, 'parentConsent': true })
            setCrequired('');
            setCdisabled('disabled');
            console.log('data = ', values)
        } else if (!ischecked) {
            setValues({ ...values, 'parentConsent': false })
            setCrequired('required');
            setCdisabled('');
            console.log('data = ', values)
        }
    }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form onSubmit={handleSubmit}>

                    <p className="h5 text-center mb-4">Sign in</p>
                    <div className="grey-text">

                        <MDBInput
                            label="First Name"
                            name="fname"
                            group
                            type="text"
                            required
                            validate
                            error="Your last name needs to be a proper name"
                            success="great - that's exactly right!"
                            getValue={value => getUserData(value, "fname")}
                        />
                        <MDBInput
                            label="Last Name"
                            name="lname"
                            group
                            type="text"
                            validate
                            required
                            error="Your last name needs to be a proper name"
                            success="great - that's exactly right!"
                            getValue={value => getUserData(value, "lname")} />

                        <MDBInput
                            label="Email"
                            name="email"
                            group
                            type="email"
                            validate
                            required
                            error="This is not a valid email"
                            success="great - that's exactly right!"
                            getValue={value => getUserData(value, "email")} />
                    </div>

                    <MDBRow className="mt-5">
                        <MDBCol size="1"></MDBCol>
                        <MDBCol size="10" className="border border-dark rounded py-3">
                            <div >
                                <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>OVER 13'S...</p>
                            </div>
                            <div className='custom-control custom-checkbox pl-3'>
                                <input
                                    className='custom-control-input'
                                    type='checkbox'
                                    value=''
                                    id='consent'
                                    error="You need to check this box or the under 13's box"
                                    success="great - that's exactly right!"
                                    onChange={getConsent}
                                    required={Crequired}
                                    disabled={Cdisabled}
                                />
                                <label className='custom-control-label' htmlFor='consent'>
                                    Please use my details to update me on new videos - I am over 13
                                </label>
                                <div className='invalid-feedback'>
                                    Either tick this box or the one for under 13 year olds please
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className='mt-3'>
                        <MDBCol size="1"></MDBCol>
                        <MDBCol size="10" className="border border-dark rounded py-3">
                            <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>UNDER 13'S...</p>

                            <div className='custom-control custom-checkbox pl-3'>
                                <input
                                    className='custom-control-input'
                                    type='checkbox'
                                    value=''
                                    id='parentConsent'
                                    onChange={getParentConsent}
                                    error="You need to check this box or the over 13's box"
                                    success="great - that's exactly right!"
                                    required={PCrequired}
                                    disabled={PCdisabled}
                                />
                                <label className='custom-control-label' htmlFor='parentConsent'>
                                    Please use my details to update me on new videos - I have my parent's permission & here is their name and email address
                                </label>
                                <div className='invalid-feedback'>
                                    You must get your parent's permission - we will email them to tell them you subscribed (we have to by law!)
                                </div>
                            </div>
                            <div>
                                <MDBInput
                                    label="Parent Name"
                                    name="pname"
                                    group
                                    type="text"
                                    validate
                                    required={PCrequired}
                                    error="You must give us your parent's name so we can tell them you subscribed"
                                    success="great - that's exactly right!"
                                    getValue={value => getUserData(value, "pname")} />

                                <MDBInput
                                    label="ParentEmail"
                                    name="pEmail"
                                    group
                                    type="email"
                                    validate
                                    required={PCrequired}
                                    error="This is not a valid email"
                                    success="great - that's exactly right!"
                                    getValue={value => getUserData(value, "pEmail")} />
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol size="12" className='d-flex justify-content-center pt-5'>
                            <div>
                                {loading &&
                                    <Spinner />

                                }
                                {alert &&
                                    <MDBAlert color="warning" dismiss >
                                        You have already subscribed with this email! Close this message and try with a different email.
                            </MDBAlert>
                                }
                                {success &&
                                    <MDBAlert color="success" dismiss >
                                        Yay! You have succesfully subscribed with these details! Close the subscribe box to carry on.
                            </MDBAlert>
                                }
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol size="12" className='d-flex justify-content-center pt-5'>
                            <div>
                                <MDBBtn color='primary' type='submit'>
                                    Submit Form
                            </MDBBtn>
                            </div>

                        </MDBCol>
                    </MDBRow>
                </form>

            </MDBCol>
        </MDBRow>

    )
}
