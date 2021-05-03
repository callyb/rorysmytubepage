import React, { useState, useEffect, useReducer } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBAlert } from 'mdbreact';
import Spinner from './Spinner';
import firebase from 'firebase/app';
import 'firebase/firestore';
import $ from 'jquery';

export default () => {

    const db = firebase.firestore().collection('users');
    const initialState =
    {
        fname: '',
        lname: '',
        email: '',
        consent: '',
        parentConsent: '',
        pname: '',
        pEmail: ''
    };

    const reducer = (state, action) => {
        if (action.type === "reset") {
            return initialState;
        }

        const result = { ...state };
        result[action.type] = action.value;
        return result;
    };

    const [userEmails, setUserEmails] = useState([]);
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);
    const [Crequired, setCrequired] = useState('required');
    const [PCrequired, setPCrequired] = useState('required');
    const [Cdisabled, setCdisabled] = useState('');
    const [PCdisabled, setPCdisabled] = useState('');

    const getUserData = (e) => {
        const { name, value } = e.target;
        dispatch({ type: name, value });
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    const { fname, lname, email, consent, parentConsent, pname, pEmail } = state;

    const handleSubmit = e => {
        e.preventDefault();
        e.target.className += ' was-validated';
        SaveUser(state)

        /* clear state */
        dispatch({ type: "reset" });

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
        if (
            userEmails.find(user => user.email === email)

        ) {
            console.log('emails from db = ', userEmails, 'current email = ', email)
            dispatch({ type: 'reset' });
            setAlert(true)

        } else {
            db.add({ 'fname': fname, 'lname': lname, 'email': email, 'consent': consent, 'parentConsent': parentConsent, 'pname': pname, 'pEmail': pEmail })
            $('input').removeAttr('required');
            $('button').prop('disabled', true);
            setSuccess(true);
        }

    };

    const getConsent = e => {
        const checked = e.target.checked;
        if (checked) {
            dispatch({ consent: true });
            setPCrequired('');
            setPCdisabled('disabled');
            console.log('data = ', state)
        } else if (!checked) {
            dispatch({ consent: false })
            setPCrequired('required');
            setPCdisabled('');
            console.log('data = ', state)
        }
    }

    const getParentConsent = e => {
        const ischecked = e.target.checked
        if (ischecked) {
            dispatch({ parentConsent: true })
            setCrequired('');
            setCdisabled('disabled');
            console.log('data = ', state)
        } else if (!ischecked) {
            dispatch({ parentConsent: false })
            setCrequired('required');
            setCdisabled('');
            console.log('data = ', state)
        }
    }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation'

                >

                    <p className="h5 text-center mb-4">Sign in</p>
                    <div className="grey-text">
                        <label
                            htmlFor='fname'
                            className='grey-text'
                        >
                            First Name
                        </label>
                        <input
                            name="fname"
                            value={fname}
                            type="text"
                            className='form-control'
                            required
                            onChange={getUserData}
                        />
                        <div className="invalid-feedback">
                            Please provide a valid first name.
                        </div>
                        <div className="valid-feedback">Looks good!</div>

                        <label
                            htmlFor='lname'
                            className='grey-text'
                        >
                            Last name
                        </label>
                        <input
                            name="lname"
                            value={lname}
                            type="text"
                            className='form-control'
                            required
                            onChange={getUserData} />
                        <div className="invalid-feedback">
                            Please provide a valid last name.
                        </div>
                        <div className="valid-feedback">Looks good!</div>

                        <label
                            htmlFor='email'
                            className='grey-text'
                        >
                            Email address
                        </label>
                        <input
                            name="email"
                            value={email}
                            type="email"
                            required
                            className='form-control'
                            onChange={getUserData} />
                        <div className="invalid-feedback">
                            Please provide a valid email address.
                        </div>
                        <div className="valid-feedback">Looks good!</div>
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
                                    value={consent}
                                    id='consent'
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
                                    value={parentConsent}
                                    id='parentConsent'
                                    onChange={getParentConsent}
                                    required={PCrequired}
                                    disabled={PCdisabled}
                                />
                                <label className='custom-control-label' htmlFor='parentConsent'>
                                    Please use my details to update me on new videos - I have my parent's permission & here is their name and email address
                                </label>
                                <div className='invalid-feedback'>
                                    You must get your parent's permission if you're under 13, we have to check with them - it's the law! (if you're over 13, check the other box above!)
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor='pname'
                                    className='grey-text'
                                >
                                    Parent Name
                                </label>
                                <input
                                    name="pname"
                                    value={pname}
                                    type="text"
                                    className='form-control'
                                    required={PCrequired}
                                    onChange={getUserData}
                                    disabled={PCdisabled}
                                />
                                <div className="invalid-feedback">
                                    Please provide a valid first name for your parent.
                                </div>
                                <div className="valid-feedback">Looks good!</div>
                                <label
                                    htmlFor='pEmail'
                                    className='grey-text'
                                >
                                    Parent Email Address
                                </label>
                                <input
                                    name="pEmail"
                                    value={pEmail}
                                    type="email"
                                    className='form-control'
                                    required={PCrequired}
                                    onChange={getUserData}
                                    disabled={PCdisabled}
                                />
                                <div className="invalid-feedback">
                                    Please provide a valid email address for your parent.
                                </div>
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol size="12" className='d-flex justify-content-center pt-5'>
                            <div>
                                {alert &&
                                    <MDBAlert color="warning" dismiss >
                                        You have already subscribed with this email!
                            </MDBAlert>
                                }
                                {success &&
                                    <MDBAlert color="success" dismiss >
                                        Yay! You have succesfully subscribed! Close the subscribe box to carry on.
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
