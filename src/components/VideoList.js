import React from 'react';

import VideoItem from './VideoItem';

export default ({ videos, onVideoSelect }) => {

  // let shuffled = videos
  // .map((a) => ({sort: Math.random(), value: a}))
  // .sort((a, b) => a.sort - b.sort)
  // .map((a) => a.value)

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
