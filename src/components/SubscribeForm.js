import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBAlert } from 'mdbreact';
import firebase from 'firebase/app';
import 'firebase/firestore';
import produce from 'immer'
import { set, has } from "lodash";
import $ from 'jquery';
export default () => {

    function enhancedReducer(state, updateArg) {
        // check if the type of update argument is a callback function
        if (updateArg.constructor === Function) {
            return { ...state, ...updateArg(state) };
        }

        // if the type of update argument is an object
        if (updateArg.constructor === Object) {
            // does the update object have _path and _value as it's keys
            // if yes then use them to update deep object values
            if (has(updateArg, "_path") && has(updateArg, "_value")) {
                const { _path, _value } = updateArg;

                return produce(state, draft => {
                    set(draft, _path, _value);
                });
            }
            else {
                return { ...state, ...updateArg };
            }
        }

    }

    const initialState =
    {
        fname: '',
        lname: '',
        email: '',
        consent: '',
        PCdisabled: '',
        Cdisabled: '',
        PCrequired: 'required',
        Crequired: 'required',
        parentConsent: '',
        pname: '',
        pEmail: '',
        Emails: []
    };

    const db = firebase.firestore().collection('users');

    const [userEmails, setUserEmails] = useState([]);
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);

    const [state, updateState] = useReducer(enhancedReducer, initialState);

    const getUserData = useCallback(({ target: { value, name, type } }) => {
        const updatePath = name.split(".");
        const consent = [name] == 'consent';
        const parentConsent = [name] == 'parentConsent';

        // if the input is a checkbox then use callback function to update
        // the toggle state based on previous state

        // Detect which checkbox to handle disabling the other one after clicking one & vice versa
        if (type === 'checkbox' && (value === '' || value === 'false')) {

            if (consent) {

                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'PCdisabled': 'disabled'

                }))

                return

            }
            else if (parentConsent) {
                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'Cdisabled': 'disabled'

                }))

                return

            }
        } else if (type === 'checkbox' && (value === true || value === 'true')) {

            if (consent) {

                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'PCdisabled': '',
                    'PCrequired': 'required'

                }))

                return

            }
            else if (parentConsent) {

                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'Cdisabled': '',
                    'Crequired': 'required'

                }))

                return

            }
        }

        // if we have to update the root level nodes in the form
        if (updatePath.length === 1) {
            const [key] = updatePath;

            updateState({
                [key]: value
            });
        }

        // if we have to update nested nodes in the form object
        // use _path and _value to update them.
        if (updatePath.length === 2) {
            updateState({
                _path: updatePath,
                _value: value
            });
        }

    }, [],
        console.log('state = ', state),

    );

    // const getUserData = (e) => {
    //     const { name, value } = e.target;
    //     dispatch({ type: name, value });
    // }

    const handleSubmit = e => {
        e.preventDefault();
        e.target.className += ' was-validated';
        SaveUser(state)
    }

    // Save state to firebase
    useEffect(() => {
        const unsubscribe =
            firebase.firestore().collection('users').onSnapshot((snapshot) => {
                const Emails = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    email: doc.data().email
                }))
                setUserEmails(Emails);

            }, (error) => { console.log(error.message) }
            )
        return () => unsubscribe();
    }, []);

    const SaveUser = () => {
        console.log('emails at beginning of saveuser = ', userEmails)
        if (
            userEmails.find(user => user.email === state.email)

        ) {
            console.log('emails from db = ', userEmails, 'current email = ', state.email)
            setAlert(true)
        } else {
            firebase.firestore().collection('users').add({ state })
            $('input').removeAttr('required');
            $('button').prop('disabled', true);
            setSuccess(true);
        }

    };
    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation'

                >

                    <p className="h5 text-center mb-4">SUBSCRIBE</p>
                    <div className="grey-text">
                        <label
                            htmlFor='fname'
                            className='grey-text'
                        >
                            First Name
                        </label>
                        <input
                            name="fname"
                            value={state.fname}
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
                            value={state.lname}
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
                            value={state.email}
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
                                    value={state.consent}
                                    id='consent'
                                    name='consent'
                                    onChange={getUserData}
                                    checked={state.consent}
                                    required={state.Crequired}
                                    disabled={state.Cdisabled}
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
                                    value={state.parentConsent}
                                    id='parentConsent'
                                    name='parentConsent'
                                    onChange={getUserData}
                                    checked={state.ParentConsent}
                                    required={state.PCrequired}
                                    disabled={state.PCdisabled}
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
                                    value={state.pname}
                                    type="text"
                                    className='form-control'
                                    required={state.PCrequired}
                                    onChange={getUserData}
                                    disabled={state.PCdisabled}
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
                                    value={state.pEmail}
                                    type="email"
                                    className='form-control'
                                    required={state.PCrequired}
                                    onChange={getUserData}
                                    disabled={state.PCdisabled}
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
