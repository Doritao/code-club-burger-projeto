import * as Yup from "yup";
import Category from "../models/Category";
import User from "../models/User";
class CategoryController {

  

  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });

      const {admin: isAdmin} = await User.findByPk(request.userId)

      

      if(!isAdmin) {
        return response.status(401).json()
      }


      const { name } = request.body;

      const { filename: path } = request.file;


      const categoryExists = await Category.findOne({
        where: {
          name
        }
      });

      if (categoryExists) {
        return response.status(400).json({
          error: "This category already exists"
        });
      }

      const {id} = await Category.create({ name, path });

      return response.json({id, name});
    } catch (err) {
      console.log(err);
      return response.status(400).json({ error: err.errors });
    }
  }

  async index(request, response) {
    const categories = await Category.findAll();
    return response.json(categories);
  }


  
}

export default new CategoryController();