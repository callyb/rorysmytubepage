import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBAlert } from 'mdbreact';
import firebase from 'firebase/app';
import 'firebase/firestore';
import produce from 'immer'
import { set, has } from "lodash";
import $ from 'jquery';

export default () => {

    useEffect(() => {
        firebase.auth().signOut().then(() => {
            var user = firebase.auth().currentUser;

            console.log('signed out = ', user)
        }).catch((error) => {
            // An error happened.
        });

    }, []);

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
            } else {
                return { ...state, ...updateArg };
            }
        }

    }

    const initialState =
    {

        email: '',
        password: '',
        pName: '',
        parentEmail: '',
        parentConsented: '',
        PCdisabled: 'disabled',
        PNCdisabled: 'disabled',
        PCrequired: '',
        PNCrequired: '',
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState('');

    const [alert2, setAlert2] = useState(false);
    const [alert1, setAlert1] = useState(false);
    const [alert3, setAlert3] = useState(false);

    const [success, setSuccess] = useState(false);

    const [state, updateState] = useReducer(enhancedReducer, initialState);
    const db = firebase.firestore();

    const getUserData = useCallback(({ target: { value, name, type, id } }, name1, value1, id1) => {
        const updatePath = name.split(".");
        const parentConsented = [name] == 'parentConsented';
        const parentNotConsented = [name] == 'parentNotConsented';
        // if the input is a checkbox then use callback function to update
        // the toggle state based on previous state

        // Detect which checkbox to handle disabling the other one after clicking one & vice versa using returned values for both first click and subsequent clicks
        // reducers to save boolean to state
        if (type === 'checkbox' && (value === '' || value === 'false')) {

            if (parentConsented) {

                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'PNCdisabled': 'disabled'

                }))

                return

            }
            else if (parentNotConsented) {
                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'PCdisabled': 'disabled'

                }))

                return

            }
        } else if (type === 'checkbox' && (value === true || value === 'true')) {

            if (parentConsented) {

                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'PNCdisabled': '',
                    'PNCrequired': 'required'

                }))

                return

            }
            else if (parentNotConsented) {

                updateState((prevState) => ({
                    [name]: !prevState[name],
                    'PCdisabled': '',
                    'PCrequired': 'required'

                }))

                return
            }
        }
        // Detect if password and if so validate while it's being typed before saving it to state
        if (type === 'password') {
            if (value.length <= 5) {
                $('input[id=password]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=password]').removeClass('is-invalid').addClass('is-valid');
            }
        }

        // detect if email and use regex to validate while it's being typed
        if (type === 'email') {
            if (id === 'email') {
                $('#email').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=email]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=email]').removeClass("is-valid").addClass("is-invalid"); }
                });
            } else if (id === 'email2') {
                $('#email2').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=email2]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=email2]').removeClass("is-valid").addClass("is-invalid"); }
                });
            }

        }
        // detect if plain text and if so validate all based on not empty & minimum of 2 chars
        if (type === 'text' && id === 'fname' && value.length >= 1) {
            $('#fname').on('input', function () {
                if (value < 3) {
                    $('#fname').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('#fname').removeClass('is-invalid').addClass('is-valid');
                }
            }
            )
        }

        if (type === 'text' && id === 'lname' && value.length >= 1) {
            $('#lname').on('input', function () {
                if (value < 3) {
                    $('#lname').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('#lname').removeClass('is-invalid').addClass('is-valid');
                }
            }
            )
        }

        if (type === 'text' && id === 'pName' && value.length >= 1) {
            $('#pName').on('input', function () {
                if (value < 3) {
                    $('#pName').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('#pName').removeClass('is-invalid').addClass('is-valid');
                }
            }
            )
        }

        // after validation checking for format of object to save correctly to state
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

        // process uid object
        if (id1 === 'uidref') {
            updateState({
                name1: value1
            })
        }

    }, [],
    );

    const handleSubmit = e => {
        e.preventDefault();
        if ($('#email2').hasClass('is-invalid')) {
            e.target.className += ' was-validated';

        } else if ($('#email2').hasClass('is-valid')) {
            e.target.className += ' was-validated';
            SaveConsent(state)
        }

    };

    var Timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    let compareEmail = '';
    const signIn = e => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(state.email, state.password)
            .then((userCredential) => {
                // Signed in
                console.log('user = ', userCredential.user)
                $('#before_signIn').removeClass('visible').addClass('invisible');
                $('#after_signIn').removeClass('invisible').addClass('visible');
                $("form#consentForm :input[type=text]").removeAttr('disabled');
                $("form#consentForm :input[type=email]").removeAttr('disabled');
                updateState({ PCdisabled: '', PNCdisabled: '' })
            })
            .catch((error) => {
                setErrorCode(error.code);
                setErrorMsg(error.message);
                setAlert1(true);
            });
    }

    // save consent
    const SaveConsent = async () => {
        var user = firebase.auth().currentUser;

        if (state.parentConsented) {
            if (user) {
                // Set a new consent field in 'users'
                var usersRef = db.collection("users").doc(user.uid);
                await usersRef.get().then((doc) => {
                    compareEmail = doc.data().pEmail;
                    console.log('compareemail = ', compareEmail, 'state email = ', state.pEmail);
                })
                if (compareEmail === state.parentEmail) {
                    await usersRef.set({ 'consentGiven': state.parentConsented, 'dateConsentGiven': Timestamp }, { merge: true })
                    console.log('finished')
                    $('#consentBtn').prop('disabled', true);
                    setSuccess(true);
                } else (
                    setAlert3(true)
                )
            }

        } else {
            setAlert2(true)
        }
    }

    // NEED TO CLEAR ALL VALIDATION CLASSES & ALERTS:
    // const clearForm = () => {
    //     updateState({
    //         email: '',
    //         pName: '',
    //         parentEmail: '',
    //         parentConsented: ''
    //     })

    //     $("form#consentForm :input").each(function () {
    //         var input = $(this); // This is the jquery object of the input, do what you will
    //         input.removeClass('is-valid').removeClass('is-invalid');
    //     });
    //     $("#parentConsented").removeAttr('checked');
    //     $("#form#consentForm").removeClass('was-validated')

    // }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation grey-text'
                    id='consentForm'
                >
                    <MDBRow className='mt-3 d-flex align-items-center justify-content-center'>
                        <MDBCol size="11" className="border border-dark rounded p-3 mb-5">
                            <div className='d-flex align-items-center justify-content-center'>
                                <h5 className='mb-1' style={{ fontSize: '1em', fontWeight: 'bold' }}>Consent to your child subscribing to rorysmytube</h5>
                            </div>
                            <div><p style={{ fontSize: '.8em' }}>Please confirm your child's subscription with their email address and password (as shown in the email from us requesting your consent). This will make sure your consent is linked to their subscription, then you can complete the consent part of the form - Thank you!</p></div>

                            <div id='signIn' className='mb-2'>
                                <div id='emailContainer'>
                                    <label
                                        htmlFor='email'
                                    >
                                        Child's Email address
                            </label>
                                    <input
                                        name="email"
                                        value={state.email}
                                        type="email"
                                        id='email'
                                        required
                                        className='form-control'
                                        onChange={getUserData} />
                                    <div className="invalid-feedback">
                                        Please provide a valid email address.
                                </div>
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div id='passwordContainer'>
                                    <label
                                        htmlFor='password'
                                        className='grey-text'
                                    >
                                        Enter your child's password
                            </label>
                                    <input
                                        name="password"
                                        value={state.password}
                                        type="password"
                                        id='password'
                                        required
                                        className='form-control'
                                        onChange={getUserData}
                                    />
                                    <div className="invalid-feedback">
                                        The password has at least 6 letters and/or numbers! Please check it on the email we sent you.
                            </div>
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div className='mt-3 visible d-flex align-items-center justify-content-center' id='before_signIn'>
                                    <MDBBtn color='primary' onClick={signIn}>
                                        Confirm Subscription
                                    </MDBBtn>
                                </div>

                                <div className='mt-3 invisible d-flex align-items-center justify-content-center' id='after_signIn' style={{ position: 'relative', zIndex: '10', top: '-4.5em' }}>
                                    <MDBBtn color='green'>
                                        Subscription Confirmed
                                    </MDBBtn>
                                </div>
                            </div>

                            <MDBRow className='mt-3'>
                                <MDBCol size="12">
                                    <div className='custom-control custom-checkbox pl-4 py-3'>
                                        <input
                                            className='custom-control-input'
                                            type='checkbox'
                                            value={state.parentConsented || ''}
                                            id='parentConsented'
                                            name='parentConsented'
                                            required={state.PCrequired}
                                            disabled={state.PCdisabled}
                                            onChange={getUserData} />

                                        <label className='custom-control-label' htmlFor='parentConsented'>
                                            I consent to my child receiving updates on new videos and news from rorysmytube
                                </label>
                                        <div className='invalid-feedback'>
                                            Please give your consent if you would like us to be able to send your child updates from rorysmytube - you must select this or the checkbox below that refuses consent.
                            </div>
                                    </div>
                                    <div className='custom-control custom-checkbox pl-4 py-3'>
                                        <input
                                            className='custom-control-input'
                                            type='checkbox'
                                            value={state.parentNotConsented || ''}
                                            id='parentNotConsented'
                                            name='parentNotConsented'
                                            required={state.PNCrequired}
                                            disabled={state.PNCdisabled}
                                            onChange={getUserData} />

                                        <label className='custom-control-label' htmlFor='parentNotConsented'>
                                            I do NOT consent to my child receiving updates from rorysmytube - please delete their subscription.
                                </label>
                                        <div className='invalid-feedback'>
                                            Please tick this box if you do not want us to send your child updates from rorysmytube - you must select this or the checkbox above that gives consent.
                            </div>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <div id='pNameContainer'>
                                <label
                                    htmlFor='pName'
                                >
                                    Parent Name
                                </label>
                                <input
                                    name="pName"
                                    id='pName'
                                    value={state.pName || ''}
                                    type="text"
                                    className='form-control'
                                    required
                                    disabled
                                    onChange={getUserData}
                                />
                                <div className="invalid-feedback">
                                    Please provide your full name as your child completed it in his/her form! Thank you!
                                </div>
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div id='parentEmailContainer'>
                                <label
                                    htmlFor='parentEmail'
                                >
                                    Parent Email Address
                                </label>
                                <input
                                    name="parentEmail"
                                    value={state.parentEmail || ''}
                                    type="email"
                                    id='email2'
                                    className='form-control'
                                    required
                                    disabled
                                    onChange={getUserData}
                                />
                                <div className="invalid-feedback">
                                    Please provide your email address!  Thank you!
                                </div>
                                <div className="valid-feedback">Looks good!</div>
                            </div>

                            <div className='my-5 d-flex align-items-center justify-content-center' id='alertsbox'>
                                {alert1 &&
                                    <MDBAlert color="warning" dismiss >
                                        Error = {errorCode}: {errorMsg}
                                    </MDBAlert>
                                }

                                {alert2 &&
                                    <MDBAlert color="warning" dismiss >
                                        Your email does not match the email we have on record for you - please use the email address where you received the email we sent you about your consent.  Thank you!
                                    </MDBAlert>
                                }

                                {alert3 &&
                                    <MDBAlert color="warning" dismiss >
                                        You haven't confirmed your child's subscription - please enter their email & password as shown on the email we sent you <a href='mailto:carole@pixelist.design'>email</a> us. Close this box if you want to try again.
                                    </MDBAlert>
                                }

                                {success &&
                                    <MDBAlert color="success" dismiss >
                                        Yay! You have succesfully consented Thank you! Close the manage subscription box to carry on.
                                    </MDBAlert>
                                }
                            </div>

                            <div className='d-flex align-items-center justify-content-center'>
                                {/* <div>
                                    <MDBBtn color='red' onClick={clearForm}>
                                        Clear Form
                            </MDBBtn>
                                </div> */}

                                <div>
                                    <MDBBtn color='primary' id='consentBtn' type='submit'>
                                        Submit Consent
                            </MDBBtn>
                                </div>
                            </div>

                        </MDBCol>
                    </MDBRow>

                </form>

            </MDBCol>
        </MDBRow >

    )
}
