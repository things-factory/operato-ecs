import * as Sheet from './sheet'
import * as Order from './order'

export const queries = [Sheet.Query, Order.Query]

export const mutations = [Sheet.Mutation, Order.Mutation]

export const types = [...Sheet.Types, ...Order.Types]
