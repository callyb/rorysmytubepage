import React from 'react';

import VideoItem from './VideoItem';

export default ({ videos, onVideoSelect }) => {

  const listOfVideos = videos.map(video => (
    <VideoItem
      onVideoSelect={onVideoSelect}
      key={video.id}
      video={video}
    />

  ));

  return (

    <div className='list'>
      {listOfVideos}
    </div>
  );
}
