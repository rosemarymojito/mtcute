import type { ITelegramClient } from '../../client.types.js'
import type { InputPeerLike } from '../../types/index.js'
import { assertTrue } from '../../../utils/type-assertions.js'

import { resolvePeer } from './resolve-peer.js'

/**
 * Unblock a user
 *
 * @param id  User ID, username or phone number
 */
export async function unblockUser(client: ITelegramClient, id: InputPeerLike): Promise<void> {
    const r = await client.call({
        _: 'contacts.unblock',
        id: await resolvePeer(client, id),
    })

    assertTrue('contacts.unblock', r)
}
