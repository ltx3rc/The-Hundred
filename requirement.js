const shareBtn = document.getElementById("shareBtn");import { 
db 
} from "./firebase.js";


import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
onSnapshot,
query,
orderBy
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const reqName = document.getElementById("reqName");
const reqQty = document.getElementById("reqQty");

const addBtn = document.getElementById("addReq");

const reqList = document.getElementById("reqList");

const totalReq = document.getElementById("totalReq");
const urgentReq = document.getElementById("urgentReq");

const search = document.getElementById("search");



let allRequirements = [];



// ADD REQUIREMENT

addBtn.onclick = async()=>{


let name = reqName.value.trim();
let qty = reqQty.value.trim();


if(name=="" || qty==""){

alert("Please fill all details");

return;

}



await addDoc(
collection(db,"requirements"),
{

name:name,
qty:qty,
urgent:false,
time:Date.now()

});


reqName.value="";
reqQty.value="";


};




// LOAD DATA LIVE

const q = query(
collection(db,"requirements"),
orderBy("time","desc")
);



onSnapshot(q,(snapshot)=>{


allRequirements=[];


snapshot.forEach((item)=>{


allRequirements.push({

id:item.id,
...item.data()

});


});


displayRequirements(allRequirements);


});





// SHOW LIST

function displayRequirements(data){


reqList.innerHTML="";


totalReq.innerHTML=data.length;


let urgentCount=0;



data.forEach((item)=>{


if(item.urgent){

urgentCount++;

}



let div=document.createElement("div");

div.className="reqItem";


div.innerHTML=`

<div class="left">

<div class="reqName">

${item.name}

</div>


<div class="reqQty">

Quantity : ${item.qty}

</div>

</div>


<div>


<span class="badge">

${item.urgent ? "URGENT" : "NORMAL"}

</span>


<button class="delete">

🗑️

</button>


</div>

`;



div.querySelector(".delete").onclick=async()=>{


await deleteDoc(

doc(db,"requirements",item.id)

);


};



reqList.appendChild(div);



});



urgentReq.innerHTML=urgentCount;



}






// SEARCH


search.addEventListener("input",()=>{


let value = search.value.toLowerCase();



let filtered = allRequirements.filter(item=>


item.name.toLowerCase().includes(value)


);



displayRequirements(filtered);



});
