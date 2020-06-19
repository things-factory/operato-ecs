import { LiteMenu } from './lite-menu'
import { NewLiteMenu } from './new-lite-menu'
import { LiteMenuPatch } from './lite-menu-patch'
import { LiteMenuList } from './lite-menu-list'

export const Mutation = `
  createLiteMenu (
    liteMenu: NewLiteMenu!
  ): LiteMenu

  updateLiteMenu (
    name: String!
    patch: LiteMenuPatch!
  ): LiteMenu

  deleteLiteMenu (
    name: String!
  ): Boolean
`

export const Query = `
  liteMenus(filters: [Filter], pagination: Pagination, sortings: [Sorting]): LiteMenuList
  liteMenu(name: String!): LiteMenu
`

export const Types = [LiteMenu, NewLiteMenu, LiteMenuPatch, LiteMenuList]
