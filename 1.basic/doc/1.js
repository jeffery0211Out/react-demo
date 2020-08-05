class A{
    constructor(props){
        this.props= props;
    }
}

class B extends A{
   
}

let b = new B({name:'zhufeng'});
console.log(b.props.name);