import { SuccessResponse } from '~/core/success.response'
// import ProductFactory from '~/services/product.service'
import ProductFactory from '~/services/product.service.xxx'

class ProductController {
  createProduct = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Create new Product success!',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    })
  }

  publishProductByShop = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Publish Product success!',
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    })
  }

  unPublishProductByShop = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'unPublish Product success!',
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    })
  }

  getAllDraftsForShop = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get list Draft success!',
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    })
  }

  getAllPublishForShop = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get list Publish success!',
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId
      })
    })
  }

  getListSearchProducts = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get list search products success!',
      metadata: await ProductFactory.searchProducts(req.params)
    })
  }

  findAllProducts = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get list products success!',
      metadata: await ProductFactory.findAllProducts(req.query)
    })
  }

  findProduct = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get list products success!',
      metadata: await ProductFactory.findProduct({ product_id: req.params.id })
    })
  }
}

export const productController = new ProductController