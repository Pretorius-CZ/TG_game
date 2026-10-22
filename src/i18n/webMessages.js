import english from './catalogs/web/en.json' with {type:'json'};
import czech from './catalogs/web/cs.json' with {type:'json'};
import {validLanguage} from './locales.js';
import {formatMessage} from './format.js';
// The information site must not download all 200 levels of game translations.
const catalogs={en:english,cs:czech};
export function message(id,values={},language='en'){
 const code=validLanguage(language);
 return formatMessage(catalogs[code]?.[id]??english[id],values,code)??id;
}
