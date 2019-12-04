import React from "react";
import { Divider, Avatar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { MDBRow, MDBCol } from "mdbreact";
import YouTube from 'react-youtube';

export default ({ video }) => {
  const page = 
  <MDBRow>
    <div className="mx-auto">
  <div style={{paddingTop: "2em", margin: "auto"}}>Search for anything you want on </div>
  <div><img src={process.env.PUBLIC_URL + '/mytube_logo.png'} className="img-fluid float-left logo" alt="logo" style={{ width: '30%' }} /></div>
  </div>
  </MDBRow>;
  if (!video) return page
  
  const videoSrc = video.snippet.resourceId.videoId;
  console.log('vidSrc= ', videoSrc)
  // var dateObj = new Date();
  // var mon = dateObj.getMonth() + 1; //months from 1-12
  // var day = dateObj.getUTCDate();
  // var year = dateObj.getUTCFullYear();

  // var options = { month: 'long' };
  // var month = new Intl.DateTimeFormat('en-GB', options).format(mon);

  // var newdate = month + " " + day + ", " + year;

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
      <MDBRow>
        <MDBCol lg="12">
          <div className=" pt-2" style={{ fontWeight: "bolder", fontSize: "1.3em" }}>
            {video.snippet.title}
          </div>
          {/* <p style={{ color: "#2b2a2a", fontSize: "1.05em", fontWeight: "bolder" }}>
            {newdate}
          </p> */}
          <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <div style={{width: "100px"}}>
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
      </MDBRow>
      <MDBRow>
        <div className="description">
          <p>{video.snippet.description}</p>
          <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
        </div>
      </MDBRow>
    </React.Fragment >
  );
}
const useStyles = makeStyles(theme => ({
  bigAvatar: {
    width: "60px",
    height: "60px"
  },
}));