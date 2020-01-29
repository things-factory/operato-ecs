import { Tool } from './tool'
import { ToolList } from './tool-list'
import { NewTool } from './new-tool'
import { ToolPatch } from './tool-patch'
import { Filter, Pagination, Sorting } from '@things-factory/shell'

export const Mutation = `
  createTool (
    tool: NewTool!
  ): Tool

  updateTool (
    id: String!
    patch: ToolPatch!
  ): Tool
  
  updateMultipleTool (
    patches: [ToolPatch]!
  ): [Tool]

  deleteTool (
    id: String!
  ): Tool
`

export const Query = `
  tools(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ToolList
  tool(id: String!): Tool
`

export const Types = [Filter, Pagination, Sorting, Tool, NewTool, ToolPatch, ToolList]
