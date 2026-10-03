import React from 'react';
import StoryComic from './StoryComic.jsx';
import {relayStoryPanels} from './relayStory.js';

export default function RelayStory({onFinish,replay=false}){
 return <StoryComic panels={relayStoryPanels} chapter="CHAPTER 08 / THE NIGHT GARDEN" title="Night garden descent story" finishLabel={replay?'Close':'Enter the night garden'} onFinish={onFinish}/>;
}
