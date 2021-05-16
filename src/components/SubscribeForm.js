import React, { useCallback, useReducer, useState } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBAlert } from 'mdbreact';
import firebase from 'firebase/app';
import 'firebase/firestore';
import produce from 'immer'
import { set, has } from "lodash";
import $ from 'jquery';
import { CodeSharp } from '@material-ui/icons';

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
        password: '',
        consent: '',
        PCdisabled: '',
        Cdisabled: '',
        PCrequired: 'required',
        Crequired: 'required',
        parentConsent: '',
        pName: '',
        pEmail: '',
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState('');

    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);

    const [state, updateState] = useReducer(enhancedReducer, initialState);

    var Timestamp = firebase.firestore.Timestamp.fromDate(new Date());


    const getUserData = useCallback(({ target: { value, name, type, id } }, name1, value1, id1) => {
        const updatePath = name.split(".");
        const consent = [name] == 'consent';
        const parentConsent = [name] == 'parentConsent';
        // if the input is a checkbox then use callback function to update
        // the toggle state based on previous state

        // Detect which checkbox to handle disabling the other one after clicking one & vice versa using returned values for both first click and subsequent clicks
        // reducers to save boolean to state
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
                    $('input[id=fname]').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('input[id=fname]').removeClass('is-invalid').addClass('is-valid');
                }
            }
            )
        }

        if (type === 'text' && id === 'lname' && value.length >= 1) {
            $('#lname').on('input', function () {
                if (value < 3) {
                    $('input[id=lname]').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('input[id=lname]').removeClass('is-invalid').addClass('is-valid');
                }
            }
            )
        }

        if (type === 'text' && id === 'pName' && value.length >= 1) {
            $('#pName').on('input', function () {
                if (value < 3) {
                    $('input[id=pName]').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('input[id=pName]').removeClass('is-invalid').addClass('is-valid');
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
        // check form is fully validated before saving user
        if ($('input[type=password]').hasClass('is-invalid')) {
            e.target.className += ' was-validated';

        } else if ($('input[type=password]').hasClass('is-valid')) {
            e.target.className += ' was-validated';
            SaveUser(state)
        }
    }

    // authenticate and save user
    const SaveUser = async () => {
        await firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
            .then(async (userCredential) => {
                // Signed in 
                const user = firebase.auth().currentUser;
                console.log('uid = ', user.uid)
                // add only required user info incl uid to 'users' collection
                await firebase.firestore().collection('users').doc(user.uid).set({ 'fname': state.fname, 'lname': state.lname, 'email': state.email, 'consent': state.consent, 'parentConsentRequired': state.parentConsent, 'parentEmail': state.pEmail, 'pName': state.pName, 'password': state.password, 'DateFirstSubscribed': Timestamp })
                $('button').prop('disabled', true);
                // setSuccess with success/completed message
                setSuccess(true);
            }).catch((error) => {
                setErrorCode(error.code);
                setErrorMsg(error.message);
                // setAlert with error message & code
                setAlert(true);
            })

    }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation'

                >

                    <p className="h5 text-center mb-4">SUBSCRIBE</p>
                    <div className="grey-text">
                        <div id='fnameContainer'>
                            <label
                                htmlFor='fname'
                                className='grey-text'
                            >
                                First Name
                        </label>
                            <input
                                name="fname"
                                value={state.fname}
                                id='fname'
                                type="text"
                                className='form-control'
                                required
                                onChange={getUserData}
                            />
                            <div className="invalid-feedback">
                                Please provide a valid first name.
                        </div>
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div id='lnameContainer'>
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
                                id='lname'
                                className='form-control'
                                required
                                onChange={getUserData} />
                            <div className="invalid-feedback">
                                Please provide a valid last name.
                        </div>
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div id='emailContainer'>
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
                                Make a password
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
                                Please pick a password with at least 6 letters and/or numbers!
                        </div>
                            <div className="valid-feedback">Looks good!</div>
                        </div>
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
                            <div id='pNameContainer'>
                                <label
                                    htmlFor='pName'
                                    className='grey-text'
                                >
                                    Parent Name
                                </label>
                                <input
                                    name="pName"
                                    id='pName'
                                    value={state.pName}
                                    type="text"
                                    className='form-control'
                                    required={state.PCrequired}
                                    onChange={getUserData}
                                    disabled={state.PCdisabled}
                                />
                                <div className="invalid-feedback">
                                    Please provide your parent's actual full name! Thank you!
                                </div>
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div id='pEmailContainer'>
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
                                    id='email2'
                                    className='form-control'
                                    required={state.PCrequired}
                                    onChange={getUserData}
                                    disabled={state.PCdisabled}
                                />
                                <div className="invalid-feedback">
                                    Please provide your parent's actual email address!  Thank you!.
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
                                        `Error code = ${errorCode}: (${errorMsg})`
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
