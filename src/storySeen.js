const memory=new Set();
export function storySeenKey(story,profile='guest',revision=0){
 return `beyond-the-signal-story:${encodeURIComponent(profile)}:${revision}:${story}`;
}
// Presentation preference only; it never changes cloud progress or read journals.
export function hasSeenStory(key,storage){
 if(memory.has(key))return true;
 try{return (storage??globalThis.localStorage)?.getItem(key)==='seen';}catch{return false;}
}
export function rememberStory(key,storage){
 memory.add(key);
 try{(storage??globalThis.localStorage)?.setItem(key,'seen');}catch{}
}
