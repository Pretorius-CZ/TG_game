import React from 'react';
import StoryComic from './StoryComic.jsx';
import {elysiumArrivalPanels} from './elysiumArrivalStory.js';

export default function ElysiumArrival({onFinish}){
 return <StoryComic panels={elysiumArrivalPanels} chapter="CHAPTER 04 / ELYSIUM" title="Approaching Elysium" finishLabel="Enter Elysium" onFinish={onFinish}/>;
}
