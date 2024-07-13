import redisPubSubService from '~/services/redisPubSub.service'

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe('purchase_events', (channel, message) => {
      console.log('🚀 ~ InventoryServiceTest ~ redisPubSubService.subscribe ~ message:', message)
      InventoryServiceTest.updateInventory(message)
    })
  }

  static updateInventory(productId, quantity) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`)
  }
}

export default new InventoryServiceTest()