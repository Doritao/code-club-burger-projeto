import * as Yup from "yup";
import User from "../models/User";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";
class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    });

    const userOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: "Make sure your email or password are correct." });
    };

    if (!(await schema.isValid(request.body))) {
      userOrPasswordIncorrect();
    }
    const { email, password } = request.body;

    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      userOrPasswordIncorrect();
    }

    if (!(await user.checkPassword(password))) {
      userOrPasswordIncorrect();
    }

    return response.json({
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
