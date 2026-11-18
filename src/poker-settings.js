const defaults={starting_chips:1000,big_blind:20,turn_seconds:30,rebuy_limit:0};
const storageKey='game-hub-poker-settings';
export function mountPokerSettings(){
 const fields={starting_chips:document.querySelector('#starting-chips'),big_blind:document.querySelector('#table-blinds'),turn_seconds:document.querySelector('#turn-seconds'),rebuy_limit:document.querySelector('#rebuy-limit')};
 const capacity=document.querySelector('#room-capacity');
 function valid(value){return Number.isInteger(value.starting_chips)&&value.starting_chips>=100&&value.starting_chips<=10000&&value.starting_chips%100===0&&[10,20,50,100,200,500].includes(value.big_blind)&&value.starting_chips>=20*value.big_blind&&[15,30,45,60,90].includes(value.turn_seconds)&&[0,1,3].includes(value.rebuy_limit);}
 try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved&&valid(saved)){for(const [key,field]of Object.entries(fields))field.value=String(saved[key]);if([2,3,4,5,6].includes(saved.capacity))capacity.value=String(saved.capacity);}}catch{}
 function read(report=true){
  const settings=Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,Number(field.value)]));
  fields.starting_chips.setCustomValidity(settings.starting_chips<settings.big_blind*20?'Starting chips must cover at least 20 big blinds.':'');
  if(!valid(settings)){if(report){document.querySelector('#poker-settings').open=true;for(const field of Object.values(fields))if(!field.reportValidity())break;}return null;}
  return settings;
 }
 function save(){const settings=read(false);if(settings)try{localStorage.setItem(storageKey,JSON.stringify({...settings,capacity:Number(capacity.value)}));}catch{}}
 for(const field of [...Object.values(fields),capacity])field.addEventListener('change',save);
 return {read,save,setBusy(value){for(const field of Object.values(fields))field.disabled=value;},describe(settings){const s=settings??defaults;return `${s.starting_chips.toLocaleString()} play chips · ${s.small_blind??s.big_blind/2}/${s.big_blind} blinds · ${s.turn_seconds}-second turns · ${s.rebuy_limit?s.rebuy_limit+(s.rebuy_limit===1?' rebuy/player':' rebuys/player'):'No rebuys'} · Rules locked`;}};
}
