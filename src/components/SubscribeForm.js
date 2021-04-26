import React, { useState, useEffect } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBInput, MDBAlert, MDBLink } from 'mdbreact';
import Spinner from './Spinner';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default () => {

    const db = firebase.firestore().collection('users');
    const [values, setValues] = useState(
        {
            fname: '',
            lname: '',
            email: '',
            pname: '',
            pEmail: ''
        });
    const [userEmails, setUserEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);
    const [done, setDone] = useState(true);

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
            db.add({ 'fname': values.fname, 'lname': values.lname, 'email': values.email, 'pname': values.pname, 'pEmail': values.pEmail })
            setLoading(false);
            setSuccess(true);
            setDone(false);
        }

    };

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

                    <div style={{ color: 'red', fontSize: '1em' }}>
                        <p>If you are under 18 you must get your parent's permission for us to save your name & email before subscribing to Rorysmytube - parents see our privacy policy<a href="https://www.pixelist.design/rorysmytube/privacy" > here</a>
                        </p>
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
                            I have my parent's permission (or am over 18)
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
                            required
                            error="You must give us your parent's name so we can tell them you subscribed"
                            success="great - that's exactly right!"
                            getValue={value => getUserData(value, "pname")} />

                        <MDBInput
                            label="ParentEmail"
                            name="pEmail"
                            group
                            type="email"
                            validate
                            required
                            error="This is not a valid email"
                            success="great - that's exactly right!"
                            getValue={value => getUserData(value, "pEmail")} />
                    </div>
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
                                Yay! You have succesfully subscribed with these details! Click on the page away from the subscribe box to carry on.
                            </MDBAlert>
                        }
                    </div>
                    {done &&
                        <MDBBtn color='primary' type='submit'>
                            Submit Form
          </MDBBtn>
                    }

                </form>
            </MDBCol>
        </MDBRow>

    )
}
