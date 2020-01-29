
import { toolResolver } from './tool'
import { toolsResolver } from './tools'

import { updateTool } from './update-tool'
import { createTool } from './create-tool'
import { deleteTool } from './delete-tool'
import { updateMultipleTool } from './update-multiple-tool'

export const Query = {
  ...toolsResolver,
  ...toolResolver
}

export const Mutation = {
  ...updateTool,
  ...createTool,
  ...deleteTool,
  ...updateMultipleTool
}
