// Only public support routing: never put an account ID, email or token in the URL.
const languages=new Set(['cs','de','fr','es','pt-BR']);
export function accountDeletionAddress(language){
 return `https://playbeyondthesignal.com/${languages.has(language)?language+'/':''}contact.html?lang=${languages.has(language)?language:'en'}#delete-account`;
}
