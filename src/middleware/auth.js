import jwt from 'jsonwebtoken';
import User from '../model/user.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGIyMTlkMGI3N2E1NjBlNjUyMTI2NWUiLCJ0ZXN0V29yZCI6InlvbWFuIiwiaWF0IjoxNjIyMjg0NzUyfQ.jS4lrpCCQ5wssQ7p8f_t1ePAgwp2dvs5xXxQj-jHPKE';
        // jwt.sign設了哪幾個屬性, 則會在jwt.verify取出那些屬性
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});

        if (!user) {
            throw new Error();
        }
        // We can actually add a property onto request to store this and the root handlers will be able to access
        req.user = user;
        req.token = token;
        
        next();

    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate.' });
    }
};

export default auth;