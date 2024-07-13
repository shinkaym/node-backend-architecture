import redisPubSubService from '~/services/redisPubSub.service'

class ProductServiceTest {
  static purchaseProduct(productId, quantity) {
    const order = { productId, quantity }
    redisPubSubService.publish('purchase_events', JSON.stringify(order))
  }
}

export default ProductServiceTest