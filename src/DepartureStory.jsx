import React from 'react';
import StoryComic from './StoryComic.jsx';
import {departurePanels} from './departureStory.js';

export default function DepartureStory({onFinish}){
 return <StoryComic panels={departurePanels} chapter="CHAPTER 02 / KEPLER REACH" title="Departure story" finishLabel="Explore Kepler Reach" onFinish={onFinish}/>;
}
