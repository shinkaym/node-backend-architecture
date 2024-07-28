import { SuccessResponse } from '~/core/success.response'
// import ProductFactory from '~/services/product.service'
import ProductFactory from '~/services/product.service.xxx'
import SkuService from '~/services/sku.service'
import SpuService from '~/services/spu.service'

class ProductController {
  findOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query
      SuccessResponse.send(res, {
        message: 'Get SPU success!',
        metadata: await SpuService.oneSpu({ spu_id: product_id })
      })
    } catch (error) {
      next(error)
    }
  }
  findOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query
      SuccessResponse.send(res, {
        message: 'Get SKU success!',
        metadata: await SkuService.oneSku({ sku_id, product_id })
      })
    } catch (error) {
      next(error)
    }
  }
  createSpu = async (req, res, next) => {
    try {
      const spu = await SpuService.newSpu({
        ...req.body,
        product_shop: req.user.userId
      })
      SuccessResponse.send(res, {
        message: 'Create new SPU success!',
        metadata: spu
      })
    } catch (error) {
      next(error)
    }
  }
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

  updateProduct = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Update Product success!',
      metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId
      } )
    })
  }
}

export const productController = new ProductController