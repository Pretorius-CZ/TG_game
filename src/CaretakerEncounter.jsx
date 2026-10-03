import React from 'react';
import StoryComic from './StoryComic.jsx';
import {caretakerPanels} from './caretakerStory.js';
export default function CaretakerEncounter({onFinish}){
 return <StoryComic panels={caretakerPanels} chapter="CHAPTER 08 / THE NIGHT GARDEN" title="Caretaker encounter" finishLabel="Coordinates saved" onFinish={onFinish}/>;
}
