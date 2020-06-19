import { liteMenuResolver } from './lite-menu'
import { liteMenusResolver } from './lite-menus'

import { updateLiteMenu } from './update-lite-menu'
import { createLiteMenu } from './create-lite-menu'
import { deleteLiteMenu } from './delete-lite-menu'

export const Query = {
  ...liteMenusResolver,
  ...liteMenuResolver
}

export const Mutation = {
  ...updateLiteMenu,
  ...createLiteMenu,
  ...deleteLiteMenu
}
