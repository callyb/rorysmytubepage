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

        }).catch((error) => {
            console.log('error = ', error)
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

        CEuserEmail: '',
        CEpassword: '',
        newEmail: ''
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState('');

    const [alert, setAlert] = useState(false);

    const [success, setSuccess] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [state, updateState] = useReducer(enhancedReducer, initialState);
    const db = firebase.firestore();

    const getUserData = useCallback(({ target: { value, name, type, id } }, name1, value1, id1) => {
        const updatePath = name.split(".");

        // Detect if password and if so validate while it's being typed before saving it to state
        if (type === 'password') {
            if (value.length <= 4) {
                $('input[id=CEpassword]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=CEpassword]').removeClass('is-invalid').addClass('is-valid');
            }
        }

        // detect if email and use regex to validate while it's being typed
        if (type === 'email') {
            if (id === 'CEuserEmail') {
                $('#CEuserEmail').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=CEuserEmail]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=CEuserEmail]').removeClass("is-valid").addClass("is-invalid"); }
                });
            } else if (id === 'newEmail') {
                $('#newEmail').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=newEmail]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=newEmail]').removeClass("is-valid").addClass("is-invalid"); }
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

        changeEmail();
    }

    const changeEmail = e => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(state.CEuserEmail, state.CEpassword)
            .then((userCredential) => {
                // Signed in
                userCredential.user.updateEmail(state.newEmail)
                var user = firebase.auth().currentUser;
                if (user) {
                    // CHANGE EMAIL
                    // TODO

                    var usersRef = db.collection("users").doc(user.uid);
                    return usersRef.update({
                        email: state.newEmail
                    })
                }
            })
            .then(() => {
                console.log("Document successfully updated!");
                setDisableBtn('disabled');
                setSuccess(true)
            }).catch(function (error) {
                // An error happened.
                setErrorCode(error.code)
                setErrorMsg(error.message)
                setAlert(true)
            });
    }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation grey-text'
                    id='changeEmailForm'
                >
                    <MDBRow className='mt-3 d-flex align-items-center justify-content-center'>
                        <MDBCol size="11" className="border border-dark rounded p-3 mb-5">
                            <div className='d-flex align-items-center justify-content-center'>
                                <h5 className='mb-1' style={{ fontSize: '1em', fontWeight: 'bold' }}>Change Your Email Address</h5>
                            </div>
                            <div><p style={{ fontSize: '.8em' }}>Please enter your email address and password to confirm your subscription</p></div>

                            <div id='signIn' className='mb-2'>
                                <div id='emailContainer' className='mb-4'>
                                    <label
                                        htmlFor='CEuserEmail'
                                    >
                                        Your Email address (the one you subscribed with!)
                                        </label>
                                    <input
                                        name="CEuserEmail"
                                        value={state.CEuserEmail || ''}
                                        type="email"
                                        id='CEuserEmail'
                                        required
                                        className='form-control'
                                        onChange={getUserData} />
                                    <div className="invalid-feedback">
                                        Please provide a valid email address.
                                    </div>
                                    <div className="valid-feedback">Yup, that's an email address!</div>
                                </div>
                                <div id='newEmailContainer' className='mb-4'>
                                    <label
                                        htmlFor='newEmail'
                                    >
                                        Your New Email address (the one you want to change to!)
                                        </label>
                                    <input
                                        name="newEmail"
                                        value={state.newEmail || ''}
                                        type="email"
                                        id='newEmail'
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
                                        htmlFor='CEpassword'
                                        className='grey-text'
                                    >
                                        Your password
                                        </label>
                                    <input
                                        name="CEpassword"
                                        value={state.CEpassword || ''}
                                        type="password"
                                        id='CEpassword'
                                        required
                                        className='form-control'
                                        onChange={getUserData}
                                    />
                                    <div className="invalid-feedback">
                                        The password has at least 5 letters and/or numbers! Please check it on the email we sent you.
                                        </div>
                                    <div className="valid-feedback">Password is the right format!</div>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-center' id='alertsbox'>
                                <p>This will change the email address you get your updates on to a different email address - if you're under 13, please make sure you have permission to use the new email address (by law we will have to tell your parents!) </p>
                            </div>
                            <div className='mt-3 visible d-flex align-items-center justify-content-center' id='before_signIn'>
                                <MDBBtn color='primary' id='ChangeEmailBtn' onClick={changeEmail} disabled={disableBtn}>
                                    Change your email
                                    </MDBBtn>
                            </div>
                            <div className='my-1 d-flex align-items-center justify-content-center' id='alertsbox'>
                                {alert &&
                                    <MDBAlert color="warning" dismiss >
                                        Error = {errorCode}: {errorMsg}
                                    </MDBAlert>
                                }

                                {success &&
                                    <MDBAlert color="success" dismiss >
                                        Yay! You have succesfully changed your email address!
                                        </MDBAlert>
                                }
                            </div>

                        </MDBCol>
                    </MDBRow>
                </form>

            </MDBCol>
        </MDBRow>

    )

}
