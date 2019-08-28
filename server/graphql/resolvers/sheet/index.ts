import { sheetResolver } from './sheet'
import { sheetsResolver } from './sheets'

import { updateSheet } from './update-sheet'
import { createSheet } from './create-sheet'
import { deleteSheet } from './delete-sheet'

export const Query = {
  ...sheetsResolver,
  ...sheetResolver
}

export const Mutation = {
  ...updateSheet,
  ...createSheet,
  ...deleteSheet
}
