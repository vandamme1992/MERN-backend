import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register user

export const register = async (req, res) => {
    try {
        const {username, password} = req.body

        const isUsed = await User.findOne({username})
        if (isUsed) {
            return res.json({
                message: 'Данное название уже используеться'
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username,
            password: hash
        })

        const token = jwt.sign({
                id: newUser._id,
            }, process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        await newUser.save()

        res.json({
            newUser, message: 'Регистрация прошла успешно'
        })

    } catch (err) {
        res.json({message: 'ошибка при создании пользователя'})
    }
}
//Login user
export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.'
            })
        }

        const decryptPassword = await bcrypt.compare(password, user.password)

        if (!decryptPassword) res.json({message: 'Неверный пароль'})

//Вошли мы в систему или нет, для зашиты роутеров доступа
        const token = jwt.sign({
                id: user._id,
            }, process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )
        res.json({
            token,
            user,
            message: 'Ви вошли в систему'
        })
    } catch (err) {
        res.json({message: 'Ошибка при авторизации'})
    }
}
//Get me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.',
            })
        }

        const token = jwt.sign({
                id: user._id,
            }, process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        res.json({
            user,
            token,
        })

    } catch (err) {
        res.json({message: 'Нет доступа'})
    }
}