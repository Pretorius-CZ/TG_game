export function canUpdate({online,visible,blocked,local,cloud}) {
 return online && visible && !blocked && local==='saved' && (cloud==null||cloud==='saved');
}
export function newVersion(value,current) {
 return typeof value?.version==='string' && /^[a-zA-Z0-9-]{1,100}$/.test(value.version) && value.version!==current;
}
