import { SuccessResponse } from '~/core/success.response'
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