console.log("5-this.js");

console.log(this); // point to global

const originalfunction = function() {
    console.log("originalfunction", this);
};

const obj = {
    name: "ray",
    innerOriginalFunction: function() {
        console.log('obj\'s innerOriginalFunction:', this);
    },
    innerArrowFunction: () => {
        console.log('obj\'s innerArrowFunction:', this);
    }
};

const objAdv = {
    obj: obj
};

originalfunction(); // point to  global
obj.innerOriginalFunction(); // point to obj
obj.innerArrowFunction(); // point to obj's 作用域
objAdv.obj.innerOriginalFunction(); // point to obj

