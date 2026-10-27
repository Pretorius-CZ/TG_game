import game from './es.json' with {type:'json'};
import web from './web/es.json' with {type:'json'};
import runtime from './runtime/es.json' with {type:'json'};
export default {...game,...web,...runtime};
