import { useAccount, useExecute } from '@bootnodedev/canton-connect'
import { PartyIdInput } from '@bootnodedev/canton-dappbooster'
import { type FormEvent, type ReactElement, useState } from 'react'
import { createNoteCommand } from '../notes'

export const NoteForm = (): ReactElement | null => {
  const { account } = useAccount()
  const { execute, error } = useExecute()
  const [reader, setReader] = useState('')
  const [text, setText] = useState('')

  if (account === undefined) {
    return null
  }

  const submit = (event: FormEvent): void => {
    event.preventDefault()
    // Sends the command through the wallet
    void execute({ commands: [createNoteCommand(account.partyId, reader, text)] })
    setText('')
  }

  return (
    <form onSubmit={submit}>
      <h2>Write a note</h2>
      <PartyIdInput
        onChange={setReader}
        placeholder="Reader party ID"
        style={{ boxSizing: 'border-box' }}
        value={reader}
      />
      <textarea
        onChange={(event) => setText(event.target.value)}
        placeholder="Your note"
        value={text}
      />
      <button disabled={reader === '' || text === ''} type="submit">
        Send
      </button>
      {error !== undefined && <p>{error.message}</p>}
    </form>
  )
}
