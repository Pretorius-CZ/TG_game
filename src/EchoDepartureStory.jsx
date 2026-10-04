import React from 'react';
import StoryComic from './StoryComic.jsx';
import {echoDeparturePanels} from './echoDepartureStory.js';
export default function EchoDepartureStory({onFinish,replay=false}){
 return <StoryComic panels={echoDeparturePanels} chapter="CHAPTER 05 / THE RIFT" title="Elysium departure story" finishLabel={replay?'Close':'Investigate the echo'} onFinish={onFinish}/>;
}
