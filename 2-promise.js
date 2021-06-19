// example 1
const doWorkPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve 跟 reject 只會挑一個去走
        // 就算有兩個reject也只會挑一個走
        // resolve([7, 4, 1]);
        reject('This is error message');
    }, 2000);
});

// above is same as the function of doWorkCallback in callback.js


// for resolve and reject
doWorkPromise.then((result) => {
    console.log('Success!', result);
}).catch((error) => {
    console.log('Error!', error);
});


// promise  ==> pending (ex: setTimeout) ==> fulfilled or rejected


// example 2 波動拳
const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b);
        }, 2000);
    });
};

add(3, 6).then((sum) => {
    console.log(sum);

    add(sum, 5).then((sum2) => {
        console.log(sum2);
    });

}).catch((e) => {
    console.log(e);
});

// example 3 解決波動拳

add(1, 1).then((sum) => {
    return add(sum, 5);
}).then((sum2) => {
    console.log(sum2);
}).catch((e) => {
    console.log(e);
});






