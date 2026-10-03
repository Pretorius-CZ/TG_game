import React from 'react';
import StoryComic from './StoryComic.jsx';
import {asterJumpPanels} from './asterJumpStory.js';

export default function AsterJumpStory({onFinish}){
 return <StoryComic panels={asterJumpPanels} chapter="CHAPTER 03 / ASTER VEIL" title="Aster Veil arrival story" finishLabel="Explore Aster Veil" onFinish={onFinish}/>;
}
