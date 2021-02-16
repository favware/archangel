import { ShardEvent } from '#lib/structures/ShardEvent';
import { yellow } from 'colorette';

export class UserShardEvent extends ShardEvent {
	protected readonly title = yellow('Resumed');

	public run(id: number, replayedEvents: number) {
		this.context.client.logger.error(`${this.header(id)}: ${replayedEvents} events replayed.`);
	}
}
