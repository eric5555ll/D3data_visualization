d3.csv('./data/harry_potter.csv').then(
    res =>{
        console.log('Local CSV:',res)
    }
);
d3.json('./data/harry_potter.json').then(
    res =>{
        console.log('Local json:',res)
    }
);
//get local multi-files
const potter =d3.csv('data/harry_potter.csv');
const rings =d3.csv('data/lord_of_the_rings.csv');
Promise.all([potter, rings]).then(
    res=>{
    console.log('Multiple request:',res);
    console.log('Concat:',[res[0],...res[1]])
    // console.log('potter:',res[0]);
    // console.log('rigns:',res[1]);
    }
);
// get internet json
d3.json('https://api.chucknorris.io/jokes/search?query=dog').then(
    res=>{console.log(res.result);
        console.log(res.result[0].value)
    }
);