import React from 'react';
//jsx
let element = <h1>hello</h1>
//babel会转译
//let element = React.createElement('h1',null,'hello');

//上面这段会会在浏览里执行执行
function createElement(){
    return {type:'h1',props:{children:'hello'}};
}