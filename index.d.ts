declare module '@chris-talman/scroll-freeze'
{
	/** Manages a stack of requests for the DOM <body> to be unscrollable. */
	export class ScrollFreezeManager
	{
		/** Adds to the freeze stack. */
		public stack(): ScrollFreezeStackItem;
		/** Removes from freeze stack. */
		public unstack(item: string | ScrollFreezeStackItem): void;
	}

	/** An item on the freeze stack. */
	export class ScrollFreezeStackItem
	{
		public readonly id: string;
		constructor(id: string);
		/** Removes the item from the freeze stack. */
		public unstack(): void;
	}

	export class ScrollFreezeError extends Error
	{
		public readonly code: 'pixelNumberMissing';
	}
}