import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array().required().of(
        Yup.object().shape({
          id: Yup.number().required(),
          quantity: Yup.number().required(),
        })
      ),
    });

    console.log(request);

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const productsId = request.body.products.map(product => product.id);

    const updatedProducts = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ["name"]
        }
      ],
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      }
    };

    return response.status(201).json(updatedProducts);
  }
}

export default new OrderController();
