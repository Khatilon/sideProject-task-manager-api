import bcrypt from 'bcryptjs';

const myFunction = async () => {
    const password = 'Red12345!';
    // btcrypt.hash的第二個參數是類似複雜的概念, 調太高會跑很久, 調太低會容易被破解
    // 加密
    const hashedPassword = await bcrypt.hash(password, 8);

    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
    console.log(isMatch);
};

myFunction();