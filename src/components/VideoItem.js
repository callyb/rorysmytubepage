import React from 'react';
import { MDBCol, MDBRow } from 'mdbreact';

export default ({ video, onVideoSelect }) => {
  return (
    <MDBRow className='d-flex justify-content-left' style={{ padding: '0' }} onClick={() => onVideoSelect(video)} >
      <MDBCol size='6'>
        <img className="img-fluid img-thumbnail" style={{ marginBottom: '15px' }} alt='thumbnail' src={video.snippet.thumbnails.medium.url} />
      </MDBCol>
      <MDBCol size='6' className='d-flex flex-column'>
        <p className='py-0 my-0 ml-2 font-weight-bolder list-heading'>
          {video.snippet.title}
        </p>
        <p className='py-0 my-0 ml-2'>
          {'567turtle'}
        </p>
      </MDBCol>
    </MDBRow>
  );
}
