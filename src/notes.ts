// A template id in `#package-name:Module:Template` form. The participant resolves it to whichever
// package id it holds, so a rebuild of the DAR needs no edit here.
export const NOTE_TEMPLATE_ID = '#notes:Note:Note'

export type Note = {
  author: string
  reader: string
  text: string
}

// JSON Ledger API v2 create command.
export const createNoteCommand = (author: string, reader: string, text: string) => ({
  CreateCommand: {
    templateId: NOTE_TEMPLATE_ID,
    createArguments: { author, reader, text },
  },
})

// JSON Ledger API v2 exercise command. Acknowledge takes no arguments.
export const acknowledgeCommand = (contractId: string) => ({
  ExerciseCommand: {
    choice: 'Acknowledge',
    choiceArgument: {},
    contractId,
    templateId: NOTE_TEMPLATE_ID,
  },
})

export const toNote = (createArgument: unknown): Note | undefined => {
  if (typeof createArgument !== 'object' || createArgument === null) {
    return undefined
  }
  if (
    !('author' in createArgument) ||
    !('reader' in createArgument) ||
    !('text' in createArgument)
  ) {
    return undefined
  }
  const { author, reader, text } = createArgument
  if (typeof author !== 'string' || typeof reader !== 'string' || typeof text !== 'string') {
    return undefined
  }
  return { author, reader, text }
}
