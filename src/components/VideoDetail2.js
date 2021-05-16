import React, { useState, useReducer, useCallback } from 'react';
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
            } else {
                return { ...state, ...updateArg };
            }
        }

    }

    const initialState =
    {
        fname: '',
        lname: '',
        email: '',
        pName: '',
        parentEmail: '',
        uid: '',
        parentConsented: ''
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState('');

    const [alert, setAlert] = useState(false);
    const [alert2, setAlert2] = useState(false);

    const [success, setSuccess] = useState(false);

    const [state, updateState] = useReducer(enhancedReducer, initialState);
    const db = firebase.firestore();

    const getUserData = useCallback(({ target: { value, name, type, id } }, name1, value1, id1) => {
        const updatePath = name.split(".");
        // if the input is a checkbox then use callback function to update
        // the toggle state based on previous state

        // Detect which checkbox to handle disabling the other one after clicking one & vice versa using returned values for both first click and subsequent clicks
        // reducers to save boolean to state
        if (type === 'checkbox' && (value === '' || value === 'false')) {

            updateState((prevState) => ({
                [name]: !prevState[name],

            }))

            return

        } else if (type === 'checkbox' && (value === true || value === 'true')) {

            updateState((prevState) => ({
                [name]: !prevState[name],

            }))

            return
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
        console.log('isvalid 2 = ', ($('#email2').hasClass('is-invalid')))
        if ($('#email2').hasClass('is-invalid')) {
            e.target.className += ' was-validated';

        } else if ($('#email2').hasClass('is-valid')) {
            e.target.className += ' was-validated';
            SaveUser(state)
        }

    };

    let uid = '';
    let compareName = '';
    var Timestamp = firebase.firestore.Timestamp.fromDate(new Date());

    // save consent
    const SaveUser = () => {
        console.log('email = ', state.email)
        // get existing info in 'users'
        db.collection("users").where("parentEmail", "==", state.parentEmail)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    uid = doc.id;
                    // doc.data() is never undefined for query doc snapshots
                    compareName = doc.data().fname;

                });
            })

            .catch((error) => {
                setErrorCode(error.code);
                setErrorMsg(error.message);
                setAlert(true);

            });
        if (state.parentConsented && (state.fname === compareName)) {
            // Set a new consent record in 'consent'
            console.log('state in save = ', uid)
            var consentRef = db.collection("consent").doc(uid);
            consentRef.set({ 'consentGiven': state.parentConsent, 'dateConsentGiven': firebase.database.ServerValue.TIMESTAMP })
            console.log('finished')
            setSuccess(true);
        } else {
            setAlert2(true);
        }
    }

    const clearForm = () => {
        updateState({
            fname: '',
            lname: '',
            email: '',
            pName: '',
            parentEmail: '',
            uid: '',
            parentConsented: ''
        })
    }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation grey-text'

                >
                    <MDBRow className='mt-3 d-flex align-items-center justify-content-center'>
                        <MDBCol size="11" className="border border-dark rounded p-3 mb-5">
                            <div className='d-flex align-items-center justify-content-center'>
                                <h5 className='mb-5' style={{ fontSize: '1em', fontWeight: 'bold' }}>Consent to your child subscribing to rorysmytube</h5>
                            </div>
                            <div id='fnameContainer' className='mb-2'>
                                <label
                                    htmlFor='fname'
                                >
                                    Child's First Name
                        </label>
                                <input
                                    name="fname"
                                    value={state.fname || ''}
                                    id='fname'
                                    type="text"
                                    className='form-control'
                                    required
                                    onChange={getUserData} />
                                <div className="invalid-feedback">
                                    Please provide a valid first name.
                        </div>
                                <div className="valid-feedback">Looks good!</div>
                            </div>

                            <div id='lnameContainer'>
                                <label
                                    htmlFor='lname'
                                >
                                    Child's Last name
                        </label>
                                <input
                                    name="lname"
                                    value={state.lname || ''}
                                    type="text"
                                    id='lname'
                                    className='form-control'
                                    required
                                    onChange={getUserData} />
                                <div className="invalid-feedback"> Please provide a valid last name.</div>

                                <div className="valid-feedback">Looks good!</div>
                            </div>
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
                            <MDBRow className='mt-3'>
                                <MDBCol size="12">
                                    <div className='custom-control custom-checkbox pl-4 py-3'>
                                        <input
                                            className='custom-control-input'
                                            type='checkbox'
                                            value={state.parentConsented || ''}
                                            id='parentConsented'
                                            name='parentConsented'
                                            required
                                            onChange={getUserData} />

                                        <label className='custom-control-label' htmlFor='parentConsented'>
                                            I consent to my child receiving updates on new videos and news from rorysmytube
                                </label>
                                        <div className='invalid-feedback'>
                                            We need your consent or will not be able to send your child updates from rorysmytube
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
                                    onChange={getUserData}
                                />
                                <div className="invalid-feedback">
                                    Please provide your email address!  Thank you!
                                </div>
                                <div className="valid-feedback">Looks good!</div>
                            </div>

                            <div className='my-5 d-flex align-items-center justify-content-center'>
                                <div>
                                    {alert &&
                                        <MDBAlert color="warning" dismiss >
                                            `Error code = ${errorCode}: (${errorMsg})`
                            </MDBAlert>
                                    }
                                    {alert2 &&
                                        <MDBAlert color="warning" dismiss >
                                            Your details do not match our records, please close & re-open the 'manage subscriptions' box and try again - thank you.
                            </MDBAlert>
                                    }
                                    {success &&
                                        <MDBAlert color="success" dismiss >
                                            Yay! You have succesfully consented Thank you! Close the manage subscription box to carry on.
                            </MDBAlert>
                                    }
                                </div>
                            </div>
                            <div className='my-5 d-flex align-items-center justify-content-center'>
                                <div>
                                    <MDBBtn color='primary' onClick={clearForm}>
                                        Clear Form
                            </MDBBtn>
                                </div>

                                <div>
                                    <MDBBtn color='primary' type='submit'>
                                        Submit Consent
                            </MDBBtn>
                                </div>
                            </div>

                        </MDBCol>
                    </MDBRow>

                </form>

            </MDBCol>
        </MDBRow>

    )
}
