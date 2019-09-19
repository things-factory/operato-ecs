import * as Sheet from './sheet'
import * as Order from './order'
import * as Stock from './stock'

export const queries = [Sheet.Query, Order.Query, Stock.Query]

export const mutations = [Sheet.Mutation, Order.Mutation, Stock.Mutation]

export const types = [...Sheet.Types, ...Order.Types, ...Stock.Types]
