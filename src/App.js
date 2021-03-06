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
      .catch((error) => {
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
    let sorted = videos.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));
    setVideos(sorted);
    setSelectedVideo(sorted[0]);

  };

  return (
    <div>

      <MDBContainer fluid className="container-fluid justify-content-center">
        <MDBRow>
          <MDBCol md="12">
            <SearchBar onSubmit={handleSubmit} />
          </MDBCol>
        </MDBRow>
        <MDBRow className="pt-2">

          <VideoDetail video={selectedVideo} onSubmit={handleSubmit} style={{ width: "100%" }} />

          <MDBCol md="4">
            <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
          </MDBCol>
        </MDBRow>
      </MDBContainer>

    </div>

  );

}
