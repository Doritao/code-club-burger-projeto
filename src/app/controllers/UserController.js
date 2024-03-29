import { v4 } from "uuid";
import * as Yup from "yup";
import User from "../models/User";

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    // if (!(await schema.isValid(request.body))) {
    //   return response
    //     .status(400)
    //     .json({ error: "Make sure the fields are filled correctly" });
    // }

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    const { name, email, password, admin } = request.body;

    const UserExists = await User.findOne({
        where: {email},
    })

    if(UserExists) {
        return response.status(409).json({ error: "User already exists." });
    }

    // console.log(UserExists)

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });
    return response.json(user);
  }
}

export default new UserController();
