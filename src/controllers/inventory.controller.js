import { SuccessResponse } from '~/core/success.response'
import CheckoutService from '~/services/checkout.service'
import InventoryService from '~/services/inventory.service'

class InventoryController {
  addStockToInventory = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'add stock to inventory success!',
      metadata: await InventoryService.addStockToInventory(req.body)
    })
  }
}

export const inventoryController = new InventoryController