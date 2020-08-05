import React from './react';
import ReactDOM from './react-dom';
function FunctionComponent(props){
  return (
   <div className="title" style={{color:'red'}}>
     <span>{props.name}</span>
     {props.children}
   </div>
  )
}
let element = <FunctionComponent name="hello">world</FunctionComponent>;
console.log(element);
console.log(JSON.stringify(element,null,2));
ReactDOM.render(element,document.getElementById('root'));