import { productResolver } from './product'
import { productsResolver } from './products'

import { updateProduct } from './update-product'
import { createProduct } from './create-product'
import { deleteProduct } from './delete-product'
import { updateMultipleProduct } from './update-multiple-product'

export const Query = {
  ...productsResolver,
  ...productResolver
}

export const Mutation = {
  ...updateProduct,
  ...createProduct,
  ...deleteProduct,
  ...updateMultipleProduct
}
