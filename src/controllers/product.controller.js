import { SuccessResponse } from '~/core/success.response'
import ProductFactory from '~/services/product.service'

class ProductController {
  createProduct = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Create new Product success!',
      metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
    })
  }
}

export const productController = new ProductController