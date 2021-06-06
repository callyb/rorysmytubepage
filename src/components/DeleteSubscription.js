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
            console.log('user signed out, record = ', user)
        }).catch((error) => {
            // An error happened.
            console.log('error = ', error.code, error.message)
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

        DSuserEmail: '',
        DSpassword: '',
        deleteConfirmed: '',

    };

    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState('');

    const [alert1, setAlert1] = useState(false);
    const [alert2, setAlert2] = useState(false);
    const [alert3, setAlert3] = useState(false);

    const [success, setSuccess] = useState(false);
    const [disableDeleteBtn, setDisableDeleteBtn] = useState('');

    const [state, updateState] = useReducer(enhancedReducer, initialState);
    const db = firebase.firestore();

    const getUserData = useCallback(({ target: { value, name, type, id } }, name1, value1, id1) => {
        const updatePath = name.split(".");
        const deleteConfirmed = ([name] == 'deleteConfirmed');
        // if the input is a checkbox then use callback function to update
        // the toggle state based on previous state

        // Detect which checkbox to handle disabling the other one after clicking one & vice versa using returned values for both first click and subsequent clicks
        // reducers to save boolean to state
        if (type === 'checkbox' && (value === '' || value === 'false')) {

            if (deleteConfirmed) {

                updateState((prevState) => ({
                    [name]: !prevState[name],

                }))

                return
            }

        } else if (type === 'checkbox' && (value === true || value === 'true')) {

            if (deleteConfirmed) {

                updateState((prevState) => ({
                    [name]: !prevState[name],

                }))

                return

            }

        }

        // Detect if password and if so validate while it's being typed before saving it to state
        if (type === 'password') {
            if (value.length <= 4) {
                $('input[id=DSpassword]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=DSpassword]').removeClass('is-invalid').addClass('is-valid');
            }
        }

        // detect if email and use regex to validate while it's being typed
        if (type === 'email') {
            if (id === 'DSuserEmail') {
                $('#DSuserEmail').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=DSuserEmail]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=DSuserEmail]').removeClass("is-valid").addClass("is-invalid"); }
                });
            }
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

    }, []
    );

    const handleSubmit = e => {
        e.preventDefault();
        if (state.DSuserEmail && state.DSpassword) {
            DeleteUser();
        } else {
            setAlert3(true);
        }
    }

    const signIn = e => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(state.DSuserEmail, state.DSpassword)
            .then((userCredential) => {
                // Signed in
                $('#before_signIn2').removeClass('visible').addClass('invisible');
                $('#after_signIn2').removeClass('invisible').addClass('visible');
                updateState({ DCdisabled: '' });
            })

            .catch((error) => {
                setErrorCode(error.code);
                setErrorMsg(error.message);
                setAlert1(true);
            });
    }

    const DeleteUser = async () => {
        const user = firebase.auth().currentUser;

        if (user && state.deleteConfirmed) {
            // DELETE USER
            const usersRef = db.collection("users").doc(user.uid);

            await usersRef.delete().then(() => {
                console.log("Document successfully deleted user document!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

            user.delete().then(function () {
                // User deleted.
                setDisableDeleteBtn('disabled');
                setSuccess(true)
            }).catch(function (error) {
                // An error happened.
                setErrorCode(error.code)
                setErrorMsg(error.message)
                setAlert1(true)
            });

        } else if (!state.deleteConfirmed) {
            setAlert2(true);
        }
    };

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation grey-text'
                    id='deleteForm'
                >
                    <MDBRow className='mt-3 d-flex align-items-center justify-content-center'>
                        <MDBCol size="11" className="border border-dark rounded p-3 mb-5">
                            <div className='d-flex align-items-center justify-content-center'>
                                <h5 className='mb-1' style={{ fontSize: '1em', fontWeight: 'bold' }}>Delete your subscription to rorysmytube</h5>
                            </div>
                            <div><p style={{ fontSize: '.8em' }}>Please enter your email address and password to confirm your subscription</p></div>

                            <div id='signIn' className='mb-2'>
                                <div id='emailContainer' className='mb-4'>
                                    <label
                                        htmlFor='DSuserEmail'
                                    >
                                        Your Email address
                                        </label>
                                    <input
                                        name="DSuserEmail"
                                        value={state.DSuserEmail || ''}
                                        type="email"
                                        id='DSuserEmail'
                                        required
                                        className='form-control'
                                        onChange={getUserData} />
                                    <div className="invalid-feedback">
                                        Please provide a valid email address.
                                    </div>
                                    <div className="valid-feedback">Yup, that's an email address!</div>
                                </div>
                                <div id='passwordContainer' className='mb-4'>
                                    <label
                                        htmlFor='DSpassword'
                                        className='grey-text'
                                    >
                                        Your password
                                        </label>
                                    <input
                                        name="DSpassword"
                                        value={state.DSpassword || ''}
                                        type="password"
                                        id='DSpassword'
                                        required
                                        className='form-control'
                                        onChange={getUserData}
                                    />
                                    <div className="invalid-feedback">
                                        The password has at least 6 letters and/or numbers! Please check it on the email we sent you (or your parent if you're under 13).
                                        </div>
                                    <div className="valid-feedback">Password is the right format!</div>
                                </div>
                                <div className='mt-3 visible d-flex align-items-center justify-content-center' id='before_signIn2'>
                                    <MDBBtn color='primary' onClick={signIn}>
                                        Confirm Subscription
                                    </MDBBtn>
                                </div>

                                <div id='after_signIn2' className='mt-3 invisible d-flex align-items-center justify-content-center' style={{ position: 'relative', zIndex: '20', top: '-4.5em' }}>
                                    <MDBBtn color='green'>
                                        Subscription Confirmed
                                    </MDBBtn>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-center' id='alertsbox'>
                                <p>Please be very careful that this is what you want to do - this will remove your subscription and you will no longer get any updates from us.  We won't have any record of your information any more! </p>
                            </div>
                            <MDBRow className='mt-3'>
                                <MDBCol size="12">
                                    <div className='custom-control custom-checkbox pl-4 py-3'>
                                        <input
                                            className='custom-control-input'
                                            type='checkbox'
                                            value={state.deleteConfirmed || ''}
                                            id='deleteConfirmed'
                                            name='deleteConfirmed'
                                            disabled={state.DCdisabled}
                                            onChange={getUserData} />

                                        <label className='custom-control-label' htmlFor='deleteConfirmed'>
                                            I confirm I want to delete my subscription (or my child's subscription if you're a parent).
                                </label>
                                        <div className='invalid-feedback'>
                                            You must tick this box to confirm you want to delete your subscription before the button will allow you to delete it for ever!
                            </div>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <div className='my-1 d-flex align-items-center justify-content-center' id='alertsbox'>
                                {alert1 &&
                                    <MDBAlert color="warning" dismiss >
                                        Error = {errorCode}: {errorMsg}
                                    </MDBAlert>
                                }
                                {alert2 &&
                                    <MDBAlert color="warning" dismiss >
                                        Please tick the box to confirm you want to delete your subscription before you actually delete it with this button - we just want to be sure you intend to do this!
                                    </MDBAlert>
                                }

                                {alert3 &&
                                    <MDBAlert color="warning" dismiss >
                                        We need you to please fill in the email address and password for the subscription you would like to delete.
                                    </MDBAlert>
                                }

                                {success &&
                                    <MDBAlert color="success" dismiss >
                                        You have succesfully deleted your subscription - we are sorry to see you go! Close the 'manage subscription' page to carry on.
                                        </MDBAlert>
                                }
                            </div>

                            <div className='d-flex align-items-center justify-content-center'>

                                <div>
                                    <MDBBtn color='red' id='deleteBtn' type='submit' style={{ color: 'white' }}>
                                        Delete your subscription
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
