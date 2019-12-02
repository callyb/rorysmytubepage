import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import youtube from "./api/youtube";

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
    }
    )
  }

  const handleSubmit = async () => {
    const { data: { items: videos } } = await getInfo()
    console.log(videos)
    setVideos(videos);
    setSelectedVideo(videos[0]);
  }

  return (
    <MDBContainer fluid className="xlarge_margin" style={{ justifyContent: "center" }}>
      <MDBRow>
        <MDBCol xl="12">
          <SearchBar onSubmit={handleSubmit} />
        </MDBCol>
      </MDBRow>
      <MDBRow className="pt-2">
        <MDBCol xl="8" style={{paddingLeft: "4em"}}>
          <VideoDetail video={selectedVideo} style={{width: "100%"}}/>
        </MDBCol>
        <MDBCol xl="3" >
          <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>

  );

}
