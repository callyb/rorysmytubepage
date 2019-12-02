import React from "react";
import { MDBCol } from "mdbreact";

export default ({ video, onVideoSelect }) => {
  return (
    <MDBCol xs="12"  className="d-flex justify-content-left" no-gutters={true} onClick={() => onVideoSelect(video)} >
      <div >
        {/* make image responsive!!!    */}
          <img style={{ marginBottom: "15px"}} alt="thumbnail" width="200px" src={video.snippet.thumbnails.medium.url} />
      </div>
      <div className="d-flex flex-column" >
        <p className = "py-0 my-0 ml-2 font-weight-bolder" style={{fontSize:"1.1em"}}>
          {video.snippet.title}
        </p>
        <p className="py-0 my-0 ml-2">
          {'567turtle'}
        </p>
      </div>
    </MDBCol >
  );
}
