import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const itemName=document.getElementById("itemName");
const itemQty=document.getElementById("itemQty");
const addBtn=document.getElementById("addBtn");
const inventoryList=document.getElementById("inventoryList");
const search=document.getElementById("search");

let inventory=[];

async function loadInventory(){

inventory=[];

inventoryList.innerHTML="";

const snapshot=await getDocs(collection(db,"inventory"));

snapshot.forEach((d)=>{

inventory.push({

id:d.id,

...d.data()

});

});

renderInventory(inventory);

}

function renderInventory(data){

inventoryList.innerHTML="";

data.forEach((item)=>{

inventoryList.innerHTML+=`

<div class="item">

<div>

<div class="itemName">

${item.name}

</div>

<div class="itemQty">

${item.qty}

</div>

</div>

<button
onclick="deleteInventory('${item.id}')">

🗑️

</button>

</div>

`;

});

}

addBtn.onclick=async()=>{

if(itemName.value.trim()=="" || itemQty.value.trim()==""){

alert("Fill all fields");

return;

}

await addDoc(

collection(db,"inventory"),

{

name:itemName.value,

qty:itemQty.value

}

);

itemName.value="";

itemQty.value="";

loadInventory();

};
window.deleteInventory = async(id)=>{

await deleteDoc(

doc(db,"inventory",id)

);

loadInventory();

};

search.oninput=()=>{

const value=search.value.toLowerCase();

const filtered=inventory.filter(item=>

item.name.toLowerCase().includes(value)

||

item.qty.toLowerCase().includes(value)

);

renderInventory(filtered);

};

loadInventory();
