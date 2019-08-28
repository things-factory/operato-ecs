import { Sheet } from './sheet'
import { NewSheet } from './new-sheet'
import { SheetPatch } from './sheet-patch'
import { SheetList } from './sheet-list'

export const Mutation = `
  createSheet (
    sheet: NewSheet!
  ): Sheet

  updateSheet (
    name: String!
    patch: SheetPatch!
  ): Sheet

  deleteSheet (
    name: String!
  ): Boolean
`

export const Query = `
  sheets(filters: [Filter], pagination: Pagination, sortings: [Sorting]): SheetList
  sheet(name: String!): Sheet
`

export const Types = [Sheet, NewSheet, SheetPatch, SheetList]
