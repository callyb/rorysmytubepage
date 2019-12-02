import React from "react";
import { Grid } from "@material-ui/core";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

import VideoItem from "./VideoItem";

export default ({ videos, onVideoSelect }) => {
  const listOfVideos = videos.map(video => (
    <VideoItem
      onVideoSelect={onVideoSelect}
      key={video.id}
      video={video}
    />
  ));

  return (
    // <View style={{paddingVertical: "10px", overflowY: "scroll"}}>
    //   {listOfVideos}
    // </View>
 
    <div className="list">
      {listOfVideos}
    </div>
    );
}
