import { AliasPieceOptions } from '@klasa/core';
import { ApplyOptions } from '@skyra/decorators';
import { Argument, MultiArgument } from 'klasa';

@ApplyOptions<AliasPieceOptions>({
	aliases: ['...membername']
})
export default class extends MultiArgument {
	public get base(): Argument {
		return this.store.get('membername') as Argument;
	}
}
