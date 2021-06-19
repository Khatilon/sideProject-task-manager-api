const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                reject('Numbers must be non-negative');
            }
            resolve(a + b);
        }, 2000);
    });
};

const noramlFunction = () => {
    return 'ray';
};

const asyncFunction = async () => {
    // throw new Error('Something wrong');
    console.log("Step1");
    // await可以直接拿到promise完後resolve或reject的結果 並用一個變數存起來
    const sum = await add(1, 99);
    const sum2 = await add(sum, 10);
    console.log("After await, step2!");
    console.log(sum2);
    return 'ray';
};

// console.log(noramlFunction());
// // async function always return promise
// console.log(asyncFunction());

asyncFunction().then((result) => {
    console.log("result", result);
}).catch((e) => {
    // by throw new Error in asyncFunction
    console.log("error", e);
})
