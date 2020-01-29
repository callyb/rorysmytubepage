import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import youtube from "./api/youtube";
import firebase from "../src/firebase";
import 'firebase/firestore';
import { SearchBar, VideoList, VideoDetail } from "./components";

export default () => {

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
   
  const getInfo = async () => {
    return await youtube.get('search', {
      params: {
        part: "snippet",
        type: "video",
        maxResults: 50,
        key: process.env.REACT_APP_API_KEY,
        playlistId: process.env.REACT_APP_PLAYLIST_ID,
        rel: 0
      }
    })
      .then(console.log('success')
      ).catch((error) => {
        /*
               * The request was made and the server responded with a
               * status code that falls out of the range of 2xx
               */
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)

        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request);
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);

      }

      )
    
  }

  const handleSubmit = async () => {
    const { data: { items: videos } } = await getInfo()
    let shuffled = videos
  .map((a) => ({sort: Math.random(), value: a}))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value)
    setVideos(shuffled);
    setSelectedVideo(shuffled[0]);
  
  }; 
  
  return (
    <MDBContainer fluid className="xlarge_margin" style={{ justifyContent: "center" }}>
      <MDBRow>
        <MDBCol xl="12">
          <SearchBar onSubmit={handleSubmit} />
        </MDBCol>
      </MDBRow>
      <MDBRow className="pt-2">
        <MDBCol xl="8" style={{ paddingLeft: "4em" }}>
          <VideoDetail video={selectedVideo} style={{ width: "100%" }} />
        </MDBCol>
        <MDBCol xl="3" >
          <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>

  );

}
