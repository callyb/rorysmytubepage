import React, { useState, useEffect } from 'react';
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default () => {

    const db = firebase.firestore().collection('Users');

    // const [state, setState] = useState([])

    // useEffect(() => {
    //     db.where('email', '==', `${email}`)
    //         .onSnapshot(function (querySnapshot) {
    //             const user = [];
    //             querySnapshot.forEach(function (doc) {
    //                 user.push(doc.data());
    //             });
    //             setState(values);
    //         })

    // const [values, setValues] = useState({});
    const [userExists, setUserExists] = useState('none');
    const [allDone, setAllDone] = useState('none');

    // const Form = () => {
    //     const {
    //         values,
    //         handleChange,
    //         handleSubmit,
    //         errors
    //     } = useForm(login, validate);

    const changeHandler = event => {
        setValues({ [event.target.name]: event.target.value })
        console.log('values = ', values)
    }

    const submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
    };

    // const submitUser = (event, values) => {
    //     event.preventDefault();
    //     console.log('email = ', values)
    //     event.target.className += " was-validated ";
    //     db.where('email', '==', `${values.email}`)
    //         .get().then(function (doc) {
    //             if (!doc.exists) {
    //                 db.doc()
    //                     .set({ 'fname': values.fname, 'lname': values.lname, 'email': values.email })
    //                 setAllDone('block');
    //             } else {
    //                 setUserExists('block');
    //             }
    //         })
    // }

    return (
        <div>
            <form
                className='needs-validation'
                onSubmit={submitUser}
                noValidate
            >
                <MDBRow className='mt-4'>
                    <MDBCol md='12' className='mb-3'>
                        <div className='mb-5'>
                            <label
                                htmlFor='FirstName'
                                className='grey-text'
                            >
                                First name
              </label>
                            <input
                                className='form-control'
                                value={values.fname}
                                name='fname'
                                id='FirstName'
                                onChange={changeHandler}
                                type='text'
                                placeholder='First name'
                                required
                            />
                            <div className="invalid-feedback">
                                Please provide a valid first name.
                            </div>
                            <div className='valid-feedback'>Looks good!</div>
                        </div>

                        <div className='mb-5'>
                            <label
                                htmlFor='LastName'
                                className='grey-text'
                            >

                                Last name
              </label>
                            <input
                                value={values.lname}
                                name='lname'
                                onChange={changeHandler}
                                type='text'
                                id='LastName'
                                className='form-control'
                                placeholder='Last name'
                                required
                            />
                            <div className="invalid-feedback">
                                Please provide a valid last name.
                            </div>
                            <div className='valid-feedback'>Looks good!</div>
                        </div>
                        <div className='mb-5'>
                            <label
                                htmlFor='Email'
                                className='grey-text'
                                required
                            >
                                Email
              </label>
                            <input
                                value={values.email}
                                onChange={changeHandler}
                                type='email'
                                id='Email'
                                className='form-control'
                                name='email'
                                placeholder='Your Email address'
                                required
                            />
                            <small id='emailHelp' className='form-text text-muted'>
                                We'll never share your email with anyone else.
                            </small>
                            <div className="invalid-feedback">
                                Please provide a valid email address.
                            </div>
                            <div className='valid-feedback'>Looks good!</div>
                        </div>
                    </MDBCol>
                </MDBRow>
                <MDBCol md='12' className='mb-3'>
                    <div style={{ color: 'red' }}>
                        <h6>You must get your parent's permission before subscribing to Rorysmytube (if you are under 18!)</h6>
                    </div>
                    <div className='custom-control custom-checkbox pl-3'>
                        <input
                            className='custom-control-input'
                            type='checkbox'
                            value=''
                            id='invalidCheck'
                            required
                        />
                        <label className='custom-control-label' htmlFor='invalidCheck'>
                            I have my parent's permission
              </label>
                        <div className='invalid-feedback'>
                            You must get your parent's permission before submitting.
              </div>
                    </div>
                </MDBCol>
                <MDBBtn color='primary' type='submit'>
                    Submit Form
          </MDBBtn>
                <div style={{ display: userExists, color: 'blue' }}><h4>You have subscribed before - no need to do it again!</h4></div>
                <div style={{ display: allDone, color: 'blue' }}><h4>You have succesfully subscribed!</h4></div>

            </form>
        </div>
    );
}
