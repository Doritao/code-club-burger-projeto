import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";

class ProductController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        price: Yup.number().required(),
        category_id: Yup.number().required(),
        offer: Yup.boolean(),
      });

      await schema.validate(request.body, { abortEarly: false });

      const { admin: isUserAdmin } = await User.findByPk(request.userId);

      if (!isUserAdmin) {
        return response.status(401).json({ error: "User is not an admin" });
      }

      const { filename: path } = request.file;
      const { name, price, category_id, offer } = request.body;

      const product = await Product.create({
        name,
        price,
        category_id,
        path,
        offer,
      });

      return response.json(product);
    } catch (err) {
      console.error(err);
      return response.status(400).json({ error: "Validation failed", details: err.errors });
    }
  }

  async index(request, response) {
    try {
      const products = await Product.findAll({
        include: [
          { model: Category, as: "category", attributes: ["id", "name"] },
        ],
      });
      return response.json(products);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.number(),
        offer: Yup.boolean(),
      });

      await schema.validate(request.body, { abortEarly: false });

      const { admin: isUserAdmin } = await User.findByPk(request.userId);

      if (!isUserAdmin) {
        return response.status(401).json({ error: "User is not an admin" });
      }

      const { id } = request.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return response
          .status(404)
          .json({ error: "Make sure your product ID is correct." });
      }

      let path;
      if (request.file) {
        path = request.file.filename;
      }

      const { name, price, category_id, offer } = request.body;

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        {
          where: { id },
        }
      );

      return response.status(200).json();
    } catch (err) {
      console.error(err);
      return response.status(400).json({ error: "Validation failed", details: err.errors });
    }
  }
}

export default new ProductController();
