import { useAccount, useLedger } from '@bootnodedev/canton-connect'
import { useCallback, useEffect, useState } from 'react'
import { type Note, notesRequest, toNotes } from './notes'

const POLL_MS = 3000

/** Every Note the connected party can see, read again every few seconds. */
export const useNotes = (): { notes: Note[] } => {
  const { ledgerApi, isReady } = useLedger()
  const { account } = useAccount()
  const partyId = account?.partyId
  const [notes, setNotes] = useState<Note[]>([])

  const read = useCallback(async (): Promise<void> => {
    if (!isReady || partyId === undefined) {
      setNotes([])
      return
    }

    // A read is always taken at one offset, so the answer is a snapshot and not a moving target.
    const end = (await ledgerApi({ requestMethod: 'get', resource: '/v2/state/ledger-end' })) as {
      offset: string | number
    }

    setNotes(toNotes(await ledgerApi(notesRequest(partyId, end.offset))))
  }, [isReady, ledgerApi, partyId])

  // The wallet does not tell the page when a transaction lands, so the page asks.
  useEffect(() => {
    void read()
    const timer = setInterval(() => void read(), POLL_MS)
    return () => clearInterval(timer)
  }, [read])

  return { notes }
}
