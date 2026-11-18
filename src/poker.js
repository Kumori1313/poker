const ranks='23456789TJQKA';
const suits=['♣','♦','♥','♠'];
const names=['clubs','diamonds','hearts','spades'];
export function cardLabel(card) { return `${({A:'Ace',K:'King',Q:'Queen',J:'Jack',T:'10'})[ranks[card%13]] ?? ranks[card%13]} of ${names[Math.floor(card/13)]}`; }
function cardNode(card) {
  const node=document.createElement('span');
  node.className='playing-card';
  if(card===null) {node.textContent='●';node.classList.add('card-back');node.setAttribute('aria-label','Hidden card');}
  else {node.textContent=`${ranks[card%13]==='T'?'10':ranks[card%13]}${suits[Math.floor(card/13)]}`;node.setAttribute('aria-label',cardLabel(card));node.dataset.suit=names[Math.floor(card/13)];}
  return node;
}
function setText(node,value) {if(node.textContent!==value) node.textContent=value;}
export function mountPoker(container, onAction) {
  container.innerHTML='<div class="table-heading"><h3 id="poker-title" tabindex="-1"></h3><span id="poker-rules" class="hint">No-Limit Hold’em · 10/20 blinds</span></div><p id="poker-status" role="status"></p><p id="poker-clock" class="hint"></p><div id="community-cards" class="cards" role="group" aria-label="Community cards"></div><p class="hint">Your hand</p><div id="poker-own-cards" class="cards" role="group" aria-label="Your private cards"></div><p id="poker-pot"></p><ul id="poker-players" class="poker-players" aria-label="Table seats"></ul><p id="poker-last-action" class="hint"></p><div id="poker-controls" class="lobby-actions"><button id="poker-fold" class="secondary" type="button">Fold</button><button id="poker-check-call" class="button" type="button">Check</button><button id="poker-all-in" class="secondary" type="button">All-in</button></div><form id="poker-raise-form"><label for="poker-amount">Total bet this round</label><div class="input-line"><input id="poker-amount" type="number" step="1" inputmode="numeric" /><button id="poker-raise" class="secondary" type="submit">Raise to</button></div></form><div id="poker-next-wrap" class="lobby-actions"><button id="poker-next" type="button" class="button" hidden>Deal next hand</button></div><p id="poker-result" role="status"></p>';
  const el=id=>container.querySelector(`#${id}`);
  for(const id of ['poker-controls','poker-raise-form','poker-next-wrap','poker-result']) container.insertBefore(el(id),el('poker-players'));
  let latest=null, viewer=null,clockOffset=0,clockKey=null;
  const rows=new Map();
  el('poker-fold').addEventListener('click',()=>onAction('fold'));
  el('poker-check-call').addEventListener('click',()=>onAction(latest?.actions.can_check?'check':'call'));
  el('poker-all-in').addEventListener('click',()=>onAction('all_in'));
  el('poker-next').addEventListener('click',()=>onAction('next'));
  el('poker-raise-form').addEventListener('submit',event=>{event.preventDefault();if(!el('poker-amount').reportValidity())return;const amount=Number(el('poker-amount').value);if(Number.isSafeInteger(amount))onAction('raise_to',amount);});
  function clock() {
    if(!latest?.deadline || latest.street==='complete') {setText(el('poker-clock'),'');return;}
    const remaining=Math.max(0,Math.ceil((Date.parse(latest.deadline)-(Date.now()+clockOffset))/1000));
    setText(el('poker-clock'),remaining?`${remaining}s remaining`:'Waiting for the table to update…');
  }
  setInterval(clock,1000);
  return ({room,userId,busy,online})=>{
    latest=room?.poker;viewer=userId;
    container.hidden=!latest;if(!latest)return;
    container.dataset.hand=latest.hand_id;container.dataset.revision=latest.revision;
    const own=latest.players.find(p=>p.user_id===viewer);
    const turn=latest.players.find(p=>p.seat===latest.turn_seat);
    const active=latest.street!=='complete';
    const canAct=active && latest.actions.can_act && online && !busy;
    const key=`${latest.hand_id}:${latest.revision}`;
    if(clockKey!==key){clockKey=key;clockOffset=Date.parse(latest.server_time)-Date.now();}
    setText(el('poker-title'),`Hand ${latest.hand_no} · ${latest.street==='complete'?'Complete':latest.street[0].toUpperCase()+latest.street.slice(1)}`);
    setText(el('poker-status'),!online?'Reconnecting…':busy?'Submitting…':active?(turn?.user_id===viewer?'Your turn.':`Waiting for ${turn?.name ?? 'the table'}.`):room.status==='finished'?'Table finished.':room.host_id===viewer?'Ready for the next hand.':'Waiting for the host to deal.');
    clock();
    const ownKey=(own?.cards ?? []).join(',');
    if(el('poker-own-cards').dataset.cards!==ownKey){el('poker-own-cards').replaceChildren(...(own?.cards ?? []).map(cardNode));el('poker-own-cards').dataset.cards=ownKey;}
    const boardKey=latest.board.join(',');
    if(el('community-cards').dataset.cards!==boardKey){el('community-cards').replaceChildren(...latest.board.map(cardNode));el('community-cards').dataset.cards=boardKey;}
    setText(el('poker-pot'),`Pot: ${active ? latest.pot ?? 0 : latest.pots.filter(p=>p.kind==='pot').reduce((sum,p)=>sum+p.amount,0)}`);
    for(const [id,row] of rows) if(!latest.players.some(p=>p.user_id===id)){row.remove();rows.delete(id);}
    for(const player of latest.players) {
      let row=rows.get(player.user_id);
      if(!row){row=document.createElement('li');row.className='poker-seat';row.dataset.userId=player.user_id;row.innerHTML='<strong></strong><span class="seat-status hint"></span><div class="cards"></div>';rows.set(player.user_id,row);el('poker-players').append(row);}
      row.classList.toggle('current-turn',active&&player.seat===latest.turn_seat);
      row.classList.toggle('folded',player.folded||player.departed);
      const markers=[player.is_bot?'Bot':null,player.seat===latest.dealer?'Dealer':null,player.seat===latest.small_blind?'SB':null,player.seat===latest.big_blind?'BB':null,player.user_id===room.host_id?'Host':null].filter(Boolean);
      setText(row.querySelector('strong'),`${player.name}${player.user_id===viewer?' (you)':''}`);
      setText(row.querySelector('.seat-status'),`Seat ${player.seat}${markers.length?' · '+markers.join(' · '):''} · ${player.stack} chips${player.bet?' · Bet '+player.bet:''}${player.hand_rank?' · '+player.hand_rank:''}${player.departed?' · Left':player.folded?' · Folded':player.all_in?' · All-in':!player.in_hand?' · Sitting out':''}`);
      row.querySelector('.cards').hidden=player.user_id===viewer;
      const visible=player.user_id===viewer?[]:player.cards ?? (player.in_hand?[null,null]:[]);
      const cardKey=visible.map(x=>x===null?'hidden':x).join(',');
      if(row.dataset.cards!==cardKey){row.querySelector('.cards').replaceChildren(...visible.map(cardNode));row.dataset.cards=cardKey;}
    }
    setText(el('poker-last-action'),active?latest.last_action:'');
    el('poker-controls').hidden=!active;el('poker-raise-form').hidden=!active;
    el('poker-fold').disabled=!canAct;el('poker-check-call').disabled=!canAct;
    setText(el('poker-check-call'),latest.actions.can_check?'Check':`Call ${latest.actions.to_call}${own?.stack===latest.actions.to_call?' (all-in)':''}`);
    el('poker-all-in').disabled=!canAct||!latest.actions.can_all_in;
    const canRaise=canAct&&latest.actions.can_raise&&latest.actions.max_raise_to>=latest.min_raise_to;
    el('poker-amount').disabled=!canRaise;el('poker-raise').disabled=!canRaise;
    el('poker-amount').min=String(latest.min_raise_to);el('poker-amount').max=String(latest.actions.max_raise_to ?? 0);
    if(document.activeElement!==el('poker-amount') && (Number(el('poker-amount').value)<latest.min_raise_to || Number(el('poker-amount').value)>latest.actions.max_raise_to))el('poker-amount').value=latest.min_raise_to;
    setText(el('poker-raise'),latest.current_bet?'Raise to':'Bet');
    el('poker-next').hidden=active||room.host_id!==viewer||room.status!=='playing';
    el('poker-next').disabled=busy||!online||latest.players.filter(p=>!p.departed&&p.stack>0).length<2;
    const awards=latest.players.filter(p=>p.payout>0).map(p=>{const returned=latest.pots.filter(pot=>pot.kind==='return'&&pot.winners.includes(p.seat)).reduce((sum,pot)=>sum+pot.amount,0);return `${p.name}: ${p.payout-returned?`${p.payout-returned} won`:''}${returned?`${p.payout-returned?', ':''}${returned} returned`:''}`;});
    setText(el('poker-result'),active?'':`${latest.showdown?'Showdown. ':''}${awards.join(' · ')}`);
  };
}
