import { comparePassword, getBasicUserInfo } from "@common";
const User = require("@root/db/models").User
import { Op } from "sequelize";

const login = async (req, res,all=false) => {
    const {username, password} = req.fields;
    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    {email: username},
                    {username: username},
                    {phoneNumber: username},
                ]
            },
        });
        if(!users.length)
            if (all && typeof(all)==='boolean'){
                return false
            }
        else{
                return res.status(400).send({error: "Can't find user"})
            }

        if(users[0].deactivated)
            if (all && typeof(all)==='boolean'){
                return false
            }else{
                return res.status(400).send({error: "User deactivated"})
            }
        const isCorrectpassword = await comparePassword(password, users[0].password)
        if(!isCorrectpassword)
            if (all && typeof(all)==='boolean'){
                return false
            }else{
                return res.status(400).send({error: "Incorrect password"})
            }
        const user = users[0];
        const userInfo = await getBasicUserInfo(user);
        if (all && typeof(all)==='boolean'){
            return userInfo
        }else{
            res.status(200).send(userInfo)
        }

    } catch(e) {
        console.log(e);
        if (all && typeof(all)==='boolean'){
            return false
        }else{
            res.status(400).send({error: "Failed to login"})
        }
    }
}

const getMe = async(req, res) => {
    try {
        const user = req.user;
        const userInfo = await getBasicUserInfo(user);
        res.status(200).send(userInfo)
    } catch(e) {
        console.log(e);
        res.status(400).send({error: "Failed to login"})
    }

}

export {
    login,
    getMe
}
