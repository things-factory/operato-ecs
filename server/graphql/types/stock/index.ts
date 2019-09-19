import { Stock } from './stock'
import { NewStock } from './new-stock'
import { StockPatch } from './stock-patch'
import { StockList } from './stock-list'
import { Filter, Pagination, Sorting } from '@things-factory/shell'

export const Mutation = `
  createStock (
    stock: NewStock!
  ): Stock

  updateStock (
    id: String!
    patch: StockPatch!
  ): Stock

  deleteStock (
    id: String!
  ): Stock

  publishStock (
    id: String!
  ): Stock
`

export const Query = `
  stocks(filters: [Filter], pagination: Pagination, sortings: [Sorting]): StockList
  stock(id: String!): Stock
`

export const Types = [Filter, Pagination, Sorting, Stock, NewStock, StockPatch, StockList]
