import { db } from "./firebase.js";

import{
collection,
addDoc,
getDocs,
query,
where,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const today=new Date();

const todayString=today.toLocaleDateString("en-GB");

document.querySelectorAll(".autoDate").forEach(el=>{

el.innerHTML="📅 "+todayString;

});

const items=[

"refined_oil",
"royal",
"indrayani",
"boneless",
"mutton",
"butter",
"cheese"

];

async function loadOpeningBalances(){

for(const item of items){

const q=query(

collection(db,"inventory"),

where("item","==",item)

);

const snap=await getDocs(q);

let latest=0;

snap.forEach(doc=>{

const data=doc.data();

if(data.closing>latest){

latest=data.closing;

}

});

const opening=document.getElementById("opening_"+item);

if(opening){

opening.value=latest;

}

calculate(item);

}

}

function calculate(item){

const opening=parseFloat(

document.getElementById("opening_"+item).value||0

);

const received=parseFloat(

document.getElementById("received_"+item).value||0

);

const used=parseFloat(

document.getElementById("used_"+item).value||0

);

const total=opening+received;

const closing=total-used;

document.getElementById("total_"+item).value=total;

document.getElementById("closing_"+item).value=closing;

}
items.forEach(item=>{

const received=document.getElementById("received_"+item);

const used=document.getElementById("used_"+item);

if(received){

received.addEventListener("input",()=>{

calculate(item);

});

}

if(used){

used.addEventListener("input",()=>{

calculate(item);

});

}

});

document.querySelectorAll(".saveBtn").forEach(btn=>{

btn.addEventListener("click",async()=>{

const item=btn.dataset.item
.toLowerCase()
.replace(/ /g,"_");

const opening=parseFloat(document.getElementById("opening_"+item).value||0);

const received=parseFloat(document.getElementById("received_"+item).value||0);

const total=parseFloat(document.getElementById("total_"+item).value||0);

const used=parseFloat(document.getElementById("used_"+item).value||0);

const closing=parseFloat(document.getElementById("closing_"+item).value||0);

await addDoc(collection(db,"inventory"),{

date:todayString,

item:item,

opening:opening,

received:received,

total:total,

used:used,

closing:closing,

createdAt:Date.now()

});

alert(item.replace(/_/g," ")+" Saved ✅");

});

});

const search=document.getElementById("search");

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

document.querySelectorAll(".card").forEach(card=>{

const title=card.querySelector(".itemTitle");

if(!title)return;

card.style.display=

title.innerText.toLowerCase().includes(value)

?

"block"

:

"none";

});

});

loadOpeningBalances();
async function loadTodayData(){

const q=query(

collection(db,"inventory"),

where("date","==",todayString)

);

const snap=await getDocs(q);

snap.forEach(d=>{

const data=d.data();

const item=data.item;

if(document.getElementById("received_"+item)){

document.getElementById("received_"+item).value=data.received;

document.getElementById("used_"+item).value=data.used;

document.getElementById("opening_"+item).value=data.opening;

document.getElementById("total_"+item).value=data.total;

document.getElementById("closing_"+item).value=data.closing;

}

});

}

async function deleteToday(item){

const q=query(

collection(db,"inventory"),

where("date","==",todayString),

where("item","==",item)

);

const snap=await getDocs(q);

for(const d of snap.docs){

await deleteDoc(

doc(db,"inventory",d.id)

);

}

}

document.querySelectorAll(".saveBtn").forEach(btn=>{

btn.addEventListener("click",async()=>{

const item=btn.dataset.item
.toLowerCase()
.replace(/ /g,"_");

await deleteToday(item);

});

});

window.addEventListener("load",async()=>{

await loadOpeningBalances();

await loadTodayData();

});

setInterval(loadTodayData,5000);

console.log("Inventory Ready ✅");
function updateStockColor(item){

const closing=parseFloat(

document.getElementById("closing_"+item).value||0

);

const card=document.getElementById(item+"_card");

if(!card)return;

card.style.border="1px solid rgba(255,255,255,.12)";

if(closing<=10){

card.style.border="2px solid #ff3b30";

}

else if(closing<=30){

card.style.border="2px solid #FFD60A";

}

else{

card.style.border="2px solid #22c55e";

}

}

items.forEach(item=>{

const received=document.getElementById("received_"+item);

const used=document.getElementById("used_"+item);

if(received){

received.addEventListener("input",()=>{

calculate(item);

updateStockColor(item);

});

}

if(used){

used.addEventListener("input",()=>{

calculate(item);

updateStockColor(item);

});

}

});

setInterval(()=>{

items.forEach(item=>{

calculate(item);

updateStockColor(item);

});

},1000);

window.addEventListener("online",()=>{

console.log("Internet Connected ✅");

});

window.addEventListener("offline",()=>{

alert("Offline Mode");

});

console.log("🚀 The Hundred Inventory Ready");
