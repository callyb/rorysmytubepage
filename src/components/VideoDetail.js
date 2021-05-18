import React, { useEffect, useState } from 'react';
import { Divider, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MDBRow, MDBCol, MDBIcon, MDBBtn, MDBPopover, MDBPopoverBody, MDBPopoverHeader, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import firebase from 'firebase/app';
import 'firebase/firestore';
import YouTube from 'react-youtube';
import SubscribeForm from './SubscribeForm';
import HomePage from './HomePage';

export default ({ video }) => {

  if (!video) return <HomePage />

  // change code
  const db = firebase.firestore().collection('mytubePage').doc('data').collection('videos');
  const videoSrc = video.snippet.resourceId.videoId;
  const description = video.snippet.description;

  const likesRef = db.doc(videoSrc);
  let newVideoSrc = '';
  const [countLikes, setCountlikes] = useState('');
  const [countDislikes, setCountDislikes] = useState('');
  const [likeBtnDisabled, setLikeBtnDisabled] = useState(undefined);
  const [dislikeBtnDisabled, setDislikeBtnDisabled] = useState(undefined);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    newVideoSrc = video.snippet.resourceId.videoId;
    const vidName = video.snippet.title;
    // console.log(video.snippet)
    db.doc(newVideoSrc || videoSrc)
      .get().then(function (doc) {
        if (!doc.exists) {
          db.doc(newVideoSrc || videoSrc)
            .set({ 'likes': 0, 'dislikes': 0, 'title': vidName, 'description': description });
        }
      })
    setCountDislikes(0);
    setCountlikes(0);
    checkCounts();
    setLikeBtnDisabled(undefined);
    setDislikeBtnDisabled(undefined);
  }, [video])

  const checkCounts = () => {
    let useThisVideoSrc = '';
    if (newVideoSrc) { useThisVideoSrc = newVideoSrc; } else { useThisVideoSrc = videoSrc; }
    db.where(firebase.firestore.FieldPath.documentId(), '==', useThisVideoSrc)
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          let newCount = '';
          if (change.type === 'added') {
            newCount = change.doc.data();
          }
          if (change.type === 'modified') {
            newCount = change.doc.data();
          }
          if (Object.entries(newCount).length > 0 && newCount.constructor === Object) {
            if (newCount.likes) {
              setCountlikes(newCount.likes);
            }
            if (newCount.dislikes) {
              setCountDislikes(newCount.dislikes);
            }
          }
        });
      });
  }

  var dateObj = new Date();
  var mon = dateObj.getMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var options = { month: 'long' };
  var month = new Intl.DateTimeFormat('en-GB', options).format(mon);

  var newdate = month + ' ' + day + ', ' + year;

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      rel: 0,
      showinfo: 0,
      autoplay: 0,
      modestbranding: 1,
    }
  };
  const classes = useStyles();

  const increment = firebase.firestore.FieldValue.increment(1);

  let clickedLike = async () => {

    likesRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          likesRef.update({ likes: increment })
        } else {
          likesRef.set({ likes: increment }) // create the document
          console.log('likesRef = ', likesRef,)
        }
      }).then(setLikeBtnDisabled('disabled'))
  };

  let noClick = () => { };

  const clickedDislike = () => {

    likesRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          console.log('data = ', docSnapshot.data)
          likesRef.update({ dislikes: increment })
        } else {
          likesRef.set({ dislikes: increment }) // create the document
        }
      }).then(setDislikeBtnDisabled('disabled'))
  };

  return (
    <React.Fragment>
      <MDBCol md='8'>
        <MDBRow>
          <MDBCol lg='12' className='vid_container'>
            <div className='vid'>
              <YouTube videoId={videoSrc}
                opts={opts}
                containerClassName={'video_player'}
              />

            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow between>
          <MDBCol size='12'>
            <div className=' pt-2' style={{ fontWeight: 'bolder', fontSize: '1.3em' }}>
              {video.snippet.title}
            </div>

          </MDBCol>
        </MDBRow>

        <MDBRow className="d-flex align-items-center">

          <MDBCol sm='6' className='date'>

            <p style={{ color: '#2b2a2a', fontSize: '1.05em', fontWeight: 'bolder' }}>
              {newdate}
            </p>
          </MDBCol>
          <MDBCol className='spacer' size='2'></MDBCol>
          <MDBCol sm='1' size='3' className='d-flex leftThumb'>
            <div><MDBIcon icon='thumbs-up' className="grey-text" style={{ marginRight: 5, fontSize: 20, cursor: 'pointer' }} onClick={!likeBtnDisabled ? clickedLike : noClick} /></div>
            <div> <p className="count">{countLikes}</p></div>
            <div><Divider style={{ marginBottom: '20px', width: 4 }} /></div>
          </MDBCol>

          <MDBCol sm='1' size='3' className='d-flex'>
            <div> <MDBIcon icon='thumbs-down' className="grey-text" style={{ marginRight: 5, fontSize: 16, cursor: 'pointer', }} onClick={!dislikeBtnDisabled ? clickedDislike : noClick} /></div>
            <div><p className="count">{countDislikes}</p></div>
          </MDBCol>

          <MDBCol sm='2' size='6' className='d-flex justify-content-center' style={{ paddingTop: 2, paddingBottom: 2, margin: 0 }}>
            <MDBPopover
              placement='left'
              popover
              clickable
              id='popper1'
            >
              <MDBBtn outline color="none" style={{ fontSize: 10, padding: 2, color: 'grey', fontWeight: 'bold', height: '4.5em' }}>Click if you like/dislike accidentally</MDBBtn>
              <div>
                <MDBPopoverHeader>Click if you accidentally clicked like or dislike...</MDBPopoverHeader>
                <MDBPopoverBody>
                  <a href='mailto:567turtle@gmail.com'>...don't worry!  Just click here to email me and tell me which video you accidentally liked or disliked and about what time and day you did it and I will remove your vote</a>
                </MDBPopoverBody>
              </div>
            </MDBPopover>

          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol sm='12'>
            <Divider style={{ marginBottom: '20px' }} />
          </MDBCol>
        </MDBRow>
        <div className='wrapper'>
          <MDBRow>
            <MDBCol size='3'>
              <div style={{ width: '100px' }}>
                <div width='100px' className='avatar'>
                  <div className='vid'>
                    <Avatar src={process.env.PUBLIC_URL + '/Green-sea-turtle.png'} className={classes.bigAvatar} />
                  </div>
                </div>
              </div>
              <div>
                <p className='text-left mt-3' style={{ fontWeight: 'bolder', fontSize: '1.1em' }} >
                  {'567turtle'}
                </p>
              </div>
            </MDBCol>
            <MDBCol size='5'></MDBCol>
            <MDBCol size='4' className='d-flex align-self-start justify-content-center flex-wrap'>
              <MDBBtn tag='a' role='button' color='red' className='subscribeBtn d-flex align-items-center justify-content-center h5' onClick={() => setToggle(true)}>SUBSCRIBE</MDBBtn>
              <MDBModal isOpen={toggle}>
                <MDBModalHeader style={{ backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold' }} className='d-flex align-items-center justify-content-center'>
                  <div>Subscribe to receive an email each time Turtle567 posts a new video and to get extra news!</div></MDBModalHeader>
                <MDBModalBody><SubscribeForm /></MDBModalBody>
                <MDBModalFooter className='d-flex'>
                  <MDBBtn tag='a' role='button' color='primary' className='align-items-center justify-content-center h5' onClick={() => setToggle(false)}>
                    Close
          </MDBBtn>
                </MDBModalFooter>
              </MDBModal>

            </MDBCol>
          </MDBRow>

          <MDBRow>

            <MDBCol md='10' className="d-flex align-items-center">
              <div className='description'>
                <p>{video.snippet.description}</p>

                <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
              </div>
            </MDBCol>

          </MDBRow>
        </div>
      </MDBCol>
    </React.Fragment >
  );
}
const useStyles = makeStyles(theme => ({
  bigAvatar: {
    width: '60px',
    height: '60px'
  },
  btn: {
    padding: '1px',
    paddingTop: '1px',
    borderWidth: '0px',
    boxShadow: 'none',
  },
  '&:hover': {
    padding: '1px',
    borderWidth: '0px',
    boxShadow: 'none',
  }
}));