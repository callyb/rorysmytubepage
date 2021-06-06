import React, { useCallback, useReducer, useState } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBAlert, MDBTooltip } from 'mdbreact';
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
        SFuserEmail: '',
        SFpassword: '',
        consent: '',
        PCdisabled: '',
        Cdisabled: '',
        PCrequired: 'required',
        Crequired: 'required',
        parentConsent: '',
        pName: '',
        parentEmail: '',
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState('');

    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(undefined);
    const [requireConsent, setRequireConsent] = useState(undefined);
    const [disableConsent, setDisableConsent] = useState(undefined);
    const [requirePConsent, setRequirePConsent] = useState(undefined);
    const [disablePConsent, setDisablePConsent] = useState(undefined);
    const [clearFormDisabled, setClearFormDisabled] = useState(undefined);

    const [state, updateState] = useReducer(enhancedReducer, initialState);

    var Timestamp = firebase.firestore.Timestamp.fromDate(new Date());

    const getUserData = useCallback(({ target: { value, name, type, id } }, name1, value1, id1) => {
        const updatePath = name.split(".");
        const consent = ([name] == 'consent');
        const parentConsent = ([name] == 'parentConsent');
        // if the input is a checkbox then use callback function to update
        // the toggle state based on previous state

        // Detect which checkbox to handle disabling the other one after clicking one & vice versa using returned values for both first click and subsequent clicks
        // reducers to save boolean to state
        if (type === 'checkbox' && (value === '' || value === 'false')) {

            if (consent) {

                updateState((prevState) => ({
                    [name]: !prevState[name],

                }))
                setDisablePConsent(true);
                return

            }
            else if (parentConsent) {
                updateState((prevState) => ({
                    [name]: !prevState[name],

                }))
                setDisableConsent(true);
                return

            }
        } else if (type === 'checkbox' && (value === true || value === 'true')) {

            if (consent) {

                updateState((prevState) => ({
                    [name]: !prevState[name],

                }))
                setDisablePConsent(false);
                setRequirePConsent(true);
                return

            }
            else if (parentConsent) {

                updateState((prevState) => ({
                    [name]: !prevState[name],

                }))
                setDisableConsent(false);
                setRequireConsent(true);

                return
            }
        }

        // Detect if password and if so validate while it's being typed before saving it to state
        if (type === 'password') {
            if (value.length <= 4) {
                $('input[id=SFpassword]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=SFpassword]').removeClass('is-invalid').addClass('is-valid');
            }
        }

        // detect if email and use regex to validate while it's being typed
        if (type === 'email') {
            if (id === 'SFuserEmail') {
                $('#SFuserEmail').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=SFuserEmail]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=SFuserEmail]').removeClass("is-valid").addClass("is-invalid"); }
                });
            } else if (id === 'parentEmail4Consent') {
                $('#parentEmail4Consent').on('input', function () {
                    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        .test(value)) { $('input[id=parentEmail4Consent]').removeClass("is-invalid").addClass("is-valid"); }
                    else { $('input[id=parentEmail4Consent]').removeClass("is-valid").addClass("is-invalid"); }
                });
            }

        }
        // detect if plain text and if so validate all based on not empty & minimum of 2 chars
        if (type === 'text' && id === 'fname') {
            if (value.length <= 2) {
                $('input[id=fname]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=fname]').removeClass('is-invalid').addClass('is-valid');
            }
        }

        if (type === 'text' && id === 'lname') {
            if (value.length <= 2) {
                $('input[id=lname]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=lname]').removeClass('is-invalid').addClass('is-valid');
            }

        }

        if (type === 'text' && id === 'pName') {
            if (value.length <= 2) {
                $('input[id=pName]').removeClass('is-valid').addClass('is-invalid');
            } else {
                $('input[id=pName]').removeClass('is-invalid').addClass('is-valid');
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
        // check form is fully validated before saving user
        if ($('input[type=password]').hasClass('is-invalid')) {
            e.target.className += 'was-validated';

        } else if ($('input[type=password]').hasClass('is-valid')) {
            e.target.className += 'was-validated';
            SaveUser(state)

        }
    }

    // authenticate and save user
    const SaveUser = async () => {
        await firebase.auth().createUserWithEmailAndPassword(state.SFuserEmail, state.SFpassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('uid = ', user.uid)
                // add only required user info incl uid to 'users' collection
                firebase.firestore().collection('users').doc(user.uid).set({ 'fname': state.fname, 'lname': state.lname, 'email': state.SFuserEmail, 'consent': state.consent, 'parentConsentRequired': state.parentConsent, 'parentEmail': state.parentEmail, 'pName': state.pName, 'password': state.SFpassword, 'DateFirstSubscribed': Timestamp })
                setDisableSubmit(true);
                setClearFormDisabled(true);
                // setSuccess with success/completed message
                setSuccess(true);
            }).catch((error) => {
                setErrorCode(error.code);
                setErrorMsg(error.message);
                // setAlert with error message & code
                setAlert(true);
            })

    }

    const ClearForm = () => {

        updateState({
            fname: '',
            lname: '',
            SFuserEmail: '',
            SFpassword: '',
            consent: '',
            PCdisabled: '',
            Cdisabled: '',
            PCrequired: 'required',
            Crequired: 'required',
            parentConsent: '',
            pName: '',
            parentEmail: ''
        });
        setDisableSubmit(undefined);
        setRequireConsent(undefined);
        setDisableConsent(undefined);
        setRequirePConsent(undefined);
        setDisablePConsent(undefined);

        $('input').removeClass("is-valid is-invalid")
        $('form').removeClass("was-validated")

    }

    return (

        <MDBRow>
            <MDBCol size="12">
                <form
                    onSubmit={handleSubmit}
                    className='needs-validation grey-text'
                >
                    <MDBRow className='d-flex align-items-center justify-content-center'>
                        <MDBCol size="11" className="p-3">
                            <div className='d-flex align-items-center justify-content-center'>
                                <p className='mb-1' style={{ fontSize: '1em', fontWeight: 'bold' }}>Subscribe to rorysmytube</p>
                            </div>
                            <div><p style={{ fontSize: '.8em' }}>Please fill in all the boxes then fill in the box that has your age at the top (you can only choose one or the other, and if you're under 13 we need you to pick the second box that says that)  Thank you!</p></div>
                            <div>
                                <div id='fnameContainer' className='mb-4'>
                                    <label
                                        htmlFor='fname'
                                    >
                                        First Name
                        </label>
                                    <input
                                        name="fname"
                                        value={state.fname || ''}
                                        id='fname'
                                        type="text"
                                        className='form-control'
                                        required
                                        onChange={getUserData}
                                    />
                                    <div className="invalid-feedback">
                                        Your first name needs to have at least 2 letters in it.
                        </div>
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div id='lnameContainer' className='mb-4'>
                                    <label
                                        htmlFor='lname'
                                    >
                                        Last name
                        </label>
                                    <input
                                        name="lname"
                                        value={state.lname || ''}
                                        type="text"
                                        id='lname'
                                        className='form-control'
                                        required
                                        onChange={getUserData} />
                                    <div className="invalid-feedback">
                                        Your last name needs to have at least 2 letters in it.
                        </div>
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div id='emailContainer' className='mb-4'>
                                    <label
                                        htmlFor='SFuserEmail'
                                    >
                                        Your Email address
                            </label>
                                    <input
                                        name="SFuserEmail"
                                        value={state.SFuserEmail}
                                        type="email"
                                        id='SFuserEmail'
                                        required
                                        className='form-control'
                                        onChange={getUserData} />
                                    <div className="invalid-feedback">
                                        Please provide a valid email address.
                                </div>
                                    <div className="valid-feedback">Yup, that's an email address!</div>
                                </div>
                                <div id='passwordContainer' className='mb-4 pb-4'>
                                    <label
                                        htmlFor='SFpassword'
                                        className='grey-text'
                                    >
                                        Enter a password (with at least 5 letters/numbers)
                            </label>
                                    <input
                                        name="SFpassword"
                                        value={state.SFpassword || ''}
                                        type="password"
                                        id='SFpassword'
                                        required
                                        className='form-control'
                                        onChange={getUserData}
                                    />
                                    <div className="invalid-feedback">
                                        Your password needs to have at least 5 letters and numbers (or at least 5 of either one!)
                            </div>
                                    <div className="valid-feedback">Password is the right format!</div>
                                </div>
                            </div>

                            <MDBRow className='mt-3'>
                                <MDBCol size="1"></MDBCol>
                                <MDBCol size="10" className="border border-dark rounded py-4">
                                    <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>UNDER 13'S...</p>

                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                            className='custom-control-input'
                                            type='checkbox'
                                            value={state.parentConsent || ''}
                                            id='parentConsent'
                                            name='parentConsent'
                                            onChange={getUserData}
                                            checked={state.ParentConsent}
                                            required={requirePConsent}
                                            disabled={disablePConsent}
                                        />
                                        <label className='custom-control-label grey-text' htmlFor='parentConsent'>
                                            Please use my details to update me on new videos - I have my parent's permission & here is their name and email address
                                </label>
                                        <div className='invalid-feedback'>
                                            You must get your parent's permission if you're under 13, we have to check with them - it's the law! (if you're over 13, check the other box above!)
                                </div>
                                    </div>
                                    <div id='pNameContainer' className='my-4'>
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
                                            required={requirePConsent}
                                            onChange={getUserData}
                                            disabled={disablePConsent}
                                        />
                                        <div className="invalid-feedback">
                                            Please provide your parent's actual full name (at least 2 letters long)! Thank you!
                                </div>
                                        <div className="valid-feedback">Looks good!</div>
                                    </div>
                                    <div id='pEmailContainer' className='mb-4'>
                                        <label
                                            htmlFor='parentEmail'
                                        >
                                            Parent Email Address
                                </label>
                                        <input
                                            name="parentEmail"
                                            value={state.parentEmail || ''}
                                            type="email"
                                            id='parentEmail4Consent'
                                            className='form-control'
                                            required={requirePConsent}
                                            onChange={getUserData}
                                            disabled={disablePConsent}
                                        />
                                        <div className="invalid-feedback">
                                            Please provide your parent's actual email address!  Thank you!.
                                </div>
                                        <div className="valid-feedback">Yup, that's an email address!</div>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className="mt-5">
                                <MDBCol size="1"></MDBCol>
                                <MDBCol size="10" className="border border-dark rounded py-4">
                                    <div >
                                        <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>OVER 13'S...</p>
                                    </div>

                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                            className='custom-control-input'
                                            type='checkbox'
                                            value={state.consent || ''}
                                            id='consent'
                                            name='consent'
                                            onChange={getUserData}
                                            checked={state.consent}
                                            required={requireConsent}
                                            disabled={disableConsent}
                                        />
                                        <label className='custom-control-label grey-text' htmlFor='consent'>
                                            Please use my details to update me on new videos - I am over 13
                                </label>
                                        <div className='invalid-feedback'>
                                            Either tick this box or the one that says 'under 13's' please
                                </div>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol size="12" className='d-flex justify-content-center pt-5'>
                                    <div>
                                        {alert &&
                                            <MDBAlert color="warning" dismiss >
                                                Error = {errorCode}: {errorMsg})`
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
                                        <MDBTooltip
                                            domElement
                                            tag="span"
                                            placement="top"

                                        >
                                            <MDBBtn color='warning' id='ClearForm' disabled={clearFormDisabled} onClick={ClearForm}>
                                                Clear Form
                                        </MDBBtn>
                                            <span>Are you sure you want to clear the form of all the info you put in?!  Only do this if you want to start again!</span>
                                        </MDBTooltip>

                                        <MDBBtn color='primary' id='SubscribeBtn' disabled={disableSubmit} type='submit'>
                                            Submit Form
                            </MDBBtn>
                                    </div>

                                </MDBCol>
                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                </form>

            </MDBCol >
        </MDBRow >

    )
}
