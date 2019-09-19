import { stockResolver } from './stock'
import { stocksResolver } from './stocks'

import { updateStock } from './update-stock'
import { createStock } from './create-stock'
import { deleteStock } from './delete-stock'

export const Query = {
  ...stocksResolver,
  ...stockResolver
}

export const Mutation = {
  ...updateStock,
  ...createStock,
  ...deleteStock
}
