// A template id in `#package-name:Module:Template` form. The participant resolves it to whichever
// package id it holds, so a rebuild of the DAR needs no edit here.
export const NOTE_TEMPLATE_ID = '#notes:Note:Note'

export type Note = {
  author: string
  contractId: string
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

// The active-contracts read: every Note the party is a stakeholder of, at the given offset.
export const notesRequest = (partyId: string, offset: string | number) => ({
  requestMethod: 'post' as const,
  resource: '/v2/state/active-contracts',
  body: {
    filter: {
      filtersByParty: {
        [partyId]: {
          cumulative: [
            { identifierFilter: { TemplateFilter: { value: { templateId: NOTE_TEMPLATE_ID } } } },
          ],
        },
      },
    },
    activeAtOffset: offset,
    verbose: true,
  },
})

type AcsRow = {
  contractEntry?: {
    JsActiveContract?: {
      createdEvent?: {
        contractId?: string
        createArgument?: { author?: string; reader?: string; text?: string }
      }
    }
  }
}

export const toNotes = (rows: unknown): Note[] => {
  if (!Array.isArray(rows)) return []

  return (rows as AcsRow[]).flatMap((row) => {
    const created = row.contractEntry?.JsActiveContract?.createdEvent
    const { author, reader, text } = created?.createArgument ?? {}

    if (
      created?.contractId === undefined ||
      author === undefined ||
      reader === undefined ||
      text === undefined
    ) {
      return []
    }

    return [{ author, contractId: created.contractId, reader, text }]
  })
}
