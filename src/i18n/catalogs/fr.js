import game from './fr.json' with {type:'json'};
import web from './web/fr.json' with {type:'json'};
import runtime from './runtime/fr.json' with {type:'json'};
export default {...game,...web,...runtime};
