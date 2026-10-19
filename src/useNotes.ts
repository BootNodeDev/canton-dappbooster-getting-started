import { useActiveContracts } from '@bootnodedev/canton-connect'
import { NOTE_TEMPLATE_ID, toNote } from './notes'

/** Every Note the connected party can see, kept current. */
export const useNotes = () => {
  const { contracts } = useActiveContracts({
    templateId: NOTE_TEMPLATE_ID,
    decode: toNote,
    watch: true,
  })

  return { notes: (contracts ?? []).map(({ contractId, payload }) => ({ contractId, ...payload })) }
}
