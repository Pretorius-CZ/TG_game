import React from 'react';
import StoryComic from './StoryComic.jsx';
import {researchStoryPanels} from './researchStory.js';

export default function ResearchStory({onFinish,replay=false}){
 return <StoryComic panels={researchStoryPanels} chapter="ELYSIUM / RESEARCH" title="Return to Elysium story" finishLabel={replay?'Close':'Begin the research'} onFinish={onFinish}/>;
}
