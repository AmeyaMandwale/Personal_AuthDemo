

import fs from "fs"; 

async function fetchDataFromAPI(url) {  
    var result = await fetch(url);      
    const data = await result.json();   
    return data;
}

// Duplicate code block (but only once, not violating rule 6)
async function getUserInfo(url) {       
    var res = await fetch(url);         
    const user = await res.json();
    return user;
}
