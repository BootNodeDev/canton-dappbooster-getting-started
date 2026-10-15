import { useAccount, useExecute } from '@bootnodedev/canton-connect'
import { partyHint } from '@bootnodedev/canton-dappbooster'
import type { ReactElement } from 'react'
import { acknowledgeCommand } from '../notes'
import { useNotes } from '../useNotes'

export const NoteList = (): ReactElement | null => {
  const { account } = useAccount()
  const { notes } = useNotes()
  const { execute } = useExecute()

  if (account === undefined) {
    return null
  }

  return (
    <section>
      <h2>Your notes</h2>
      {notes.length === 0 ? (
        <p>Nothing here yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.contractId}>
              <div>
                <p>{note.text}</p>
                <small>from {partyHint(note.author)}</small>
              </div>
              {note.reader === account.partyId && (
                <button
                  onClick={() => void execute({ commands: [acknowledgeCommand(note.contractId)] })}
                  type="button"
                >
                  Acknowledge
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
