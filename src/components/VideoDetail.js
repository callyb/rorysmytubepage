import React, { Fragment, useEffect, useState } from "react";
import { Divider, Avatar, GridListTileBar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
import firebase from 'firebase/app';
import 'firebase/firestore';
import YouTube from 'react-youtube';

export default ({ video }) => {

  const page =

    <MDBRow end>
      <MDBCol xl="6" >
        <div className="alt_div">
          <div className="mx-auto pl-0 text-center">
            <div className="msg">Search for anything you want on </div>
            <div><img src={process.env.PUBLIC_URL + '/mytube_logo.png'} className="img-fluid logo" alt="logo" /></div>
            <div style={{ paddingTop: "8em" }}><p>Note: This page needs iOS 10 or above to show the MyTube videos</p></div>

          </div>
        </div>
      </MDBCol>
    </MDBRow>;
  if (!video) return page

  const db = firebase.firestore();
  const videoSrc = video.snippet.resourceId.videoId;
  const likesRef = db.collection("mytubePage").doc(videoSrc);
  let newVideoSrc = '';
  const [countLikes, setCountlikes] = useState('');
  const [countDislikes, setCountDislikes] = useState('');

  useEffect(() => {
    newVideoSrc = video.snippet.resourceId.videoId;
    db.collection("mytubePage").doc(newVideoSrc || videoSrc)
      .get().then(function (doc) {
        if (!doc.exists) {
          db.collection("mytubePage").doc(newVideoSrc || videoSrc)
            .set({ "likes": 0, "dislikes": 0 })
        }
      })
    setCountDislikes(0);
    setCountlikes(0);
    checkCounts();
    console.log('vid id = ', newVideoSrc);

  }, [video])

  const checkCounts = () => {
    let useThisVideoSrc = '';
    if (newVideoSrc) { useThisVideoSrc = newVideoSrc; } else { useThisVideoSrc = videoSrc; }
    db.collection("mytubePage").where(firebase.firestore.FieldPath.documentId(), '==', useThisVideoSrc)
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          let newCount = '';
          if (change.type === "added") {
            newCount = change.doc.data();
          }
          if (change.type === "modified") {
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

  var newdate = month + " " + day + ", " + year;

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { // https://developers.google.com/youtube/player_parameters
      rel: 0,
      showinfo: 0,
      autoplay: 0
    }
  };
  const classes = useStyles();

  const increment = firebase.firestore.FieldValue.increment(1);

  let clickedLike = async () => {

    likesRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          likesRef.update({ likes: increment })
          console.log('vidsrc = ', videoSrc)
        } else {
          likesRef.set({ likes: increment }) // create the document
        }
      })
  };

  const clickedDislike = () => {

    likesRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          likesRef.update({ dislikes: increment })
        } else {
          likesRef.set({ dislikes: increment }) // create the document
        }
      })
  };

  return (
    <React.Fragment>

      <MDBRow>
        <MDBCol lg="12" className="vid_container">
          <div className="vid">
            <YouTube videoId={videoSrc}
              opts={opts}
              containerClassName={"video_player"}
            />

          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow between>
        <MDBCol lg="10">
          <div className=" pt-2" style={{ fontWeight: "bolder", fontSize: "1.3em" }}>
            {video.snippet.title}<p>{videoSrc}</p>
          </div>
          <p style={{ color: "#2b2a2a", fontSize: "1.05em", fontWeight: "bolder" }}>
            {newdate}
          </p>
          <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
        </MDBCol>

        <MDBCol lg="1">
          <MDBIcon far icon="thumbs-up" style={{ paddingTop: 20, fontSize: 20, cursor: "pointer" }} onClick={clickedLike} />
          <h6 width=".5rem">{countLikes}</h6>
        </MDBCol>
        <MDBCol>
          <MDBIcon far icon="thumbs-down" style={{ paddingTop: 20, fontSize: 20, cursor: "pointer", }} onClick={clickedDislike} />
          <h6 width=".5rem">{countDislikes}</h6>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol lg="12">
          <div style={{ width: "100px" }}>
            <div width="100px" className="avatar">
              <div className="vid">
                <Avatar src={process.env.PUBLIC_URL + '/Green-sea-turtle.png'} className={classes.bigAvatar} />
              </div>
            </div>
          </div>
          <div>
            <p className="text-left mt-3" style={{ fontWeight: "bolder", fontSize: "1.1em" }} >
              {'567turtle'}
            </p>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol lg="12">
          <div className="description">
            <p>{video.snippet.description}</p>

            <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
          </div>
        </MDBCol>
      </MDBRow>
    </React.Fragment >
  );
}
const useStyles = makeStyles(theme => ({
  bigAvatar: {
    width: "60px",
    height: "60px"
  },
  btn: {
    padding: "1px",
    paddingTop: "1px",
    borderWidth: "0px",
    boxShadow: "none",
  },
  "&:hover": {
    padding: "1px",
    borderWidth: "0px",
    boxShadow: "none",
  }
}));