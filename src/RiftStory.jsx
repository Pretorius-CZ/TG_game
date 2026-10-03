import React from 'react';
import StoryComic from './StoryComic.jsx';
import {riftStoryPanels} from './riftStory.js';

export default function RiftStory({onFinish,replay=false}){
 return <StoryComic panels={riftStoryPanels} chapter="CHAPTER 05 / THE RIFT" title="Rift crossing story" finishLabel={replay?'Close':'Begin the crossing'} onFinish={onFinish}/>;
}
