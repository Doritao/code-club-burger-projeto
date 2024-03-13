import * as Yup from "yup";
import User from "../models/User";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    });
    // console.log(request.body)



    const userOrPasswordIncorrect = () => {
      return res
        .status(401)
        .json({ error: "Make sure your email or password are correct." });
    };

    if (!(await schema.isValid(req.body))) {
       userOrPasswordIncorrect();
    }
    const { email, password } = req.body;
    
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
     return res.status(404).json({
        error: 'Usuário não encontrado'
        })
    }
    
      
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({
          error: 'Email ou senha inválidos'
          })
      }
      
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
