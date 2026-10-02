const dayFormatter=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'});
export function attemptDay(row){
 const date=new Date(row.at);
 return row.at!=null&&Number.isFinite(date.getTime())?dayFormatter.format(date):null;
}
export function attemptsForDay(rows,day){return day?rows.filter(row=>attemptDay(row)===day):rows;}
