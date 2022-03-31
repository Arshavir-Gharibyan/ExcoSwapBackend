import { hashPassword, getBasicUserInfo } from "@common";

const User = require("@root/db/models").User

const registerNormalUser = async (params) => {
    try {
        const user = await User.create({
            username:params.username,
            firstName:params.firstname,
            lastName:params.lastname,
            email:params.email,
            password: await hashPassword(params.password),
            seedPhrase:params.seedparse,
            type:params.type
        });
        const userInfo = await getBasicUserInfo(user);
            return({userInfo})
    } catch(e) {
        console.log("error", e);
            return({error: 'Failed to register'})
    }
}

const registerTokenCreator = async (params, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            password,
            seedPhrase,
            website,
            telegram,
            facebook,
            twitter,
            instagram,
            linkedin,
            whitepaper,
            type
        } = params;
        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            password: await hashPassword(password),
            seedPhrase,
            website,
            telegram,
            facebook,
            twitter,
            instagram,
            linkedin,
            whitepaper,
            type
        });
        const userInfo = await getBasicUserInfo(user);
        res.status(200).send(userInfo)
    } catch(e) {
        console.log(e);
        res.status(400).send({error: 'Failed to register'})
    }
}

const registerAccount = async (req, res, all=false) => {
    const params = req.fields;
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            type,
        } = params;
        if (type == 'user'){
            const normalUser = await registerNormalUser(params);
            if(all && typeof(all)==='boolean'){
                if (normalUser){
                    return normalUser
                }
                else{
                    console.log(normalUser,1236)
                }
            }else{
                res.status(200).send(normalUser)
            }
        }
        else if(type == 'creator')
            registerTokenCreator(params, res);
        else
            res.status(400).send({error: "Unknow user type"})
    } catch(e) {
        console.log(e);
        res.status(400).send({error: 'Failed to register'})
    }
}

export {
    registerAccount
}
