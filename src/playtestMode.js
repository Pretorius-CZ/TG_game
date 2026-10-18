export const isPlaytestURL=url=>{try{const u=new URL(url);return /\/playtest\.html$/.test(u.pathname);}catch{return false;}};
