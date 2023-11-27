import * as Yup from "yup";
import Category from "../models/Category";

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });

      const { name } = request.body;

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

      const category = await Category.create({ name });

      return response.json(category);
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