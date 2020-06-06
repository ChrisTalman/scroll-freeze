'use strict';

// Types
interface Stack extends Map<string, StackItem> {};

// Constants
const CSS_CLASS_NAME = 'scroll-freeze-module-active';
const CSS_CLASS =
`
	html.${CSS_CLASS_NAME} > body
	{
		position: fixed;
		overflow-y: unset;
	}
`;

/** Manages a stack of requests for the DOM <body> to be unscrollable. */
export class Manager
{
	private stackMap: Stack = new Map();
	private stackCount = 0;
	constructor()
	{
		const styleElement = document.createElement('style');
		styleElement.classList.add(CSS_CLASS_NAME);
		document.head.insertBefore(styleElement, document.head.children[0]);
		const stylesheet = Array.from(document.styleSheets).find(stylesheet => stylesheet.ownerNode === styleElement) as CSSStyleSheet;
		stylesheet.insertRule(CSS_CLASS, 0);
	};
	/** Adds to the freeze stack. */
	public stack()
	{
		const item = new StackItem({id: this.stackCount.toString()});
		this.stackCount++;
		this.stackMap.set(item.id, item);
		if (this.stackMap.size === 1)
		{
			this.freeze();
		};
		return item;
	};
	/** Freezes body. */
	private freeze()
	{
		document.body.style.top = -(document.documentElement.scrollTop) + 'px'; // Currently resets top when class is removed.
		document.documentElement.classList.add(CSS_CLASS_NAME);
	};
	/** Removes from freeze stack. */
	public unstack(item: string | StackItem)
	{
		const id = typeof item === 'string' ? item : item.id;
		this.stackMap.delete(id);
		if (this.stackMap.size === 0)
		{
			this.unfreeze();
		};
	};
	/** Unfreezes body. */
	private unfreeze()
	{
		document.documentElement.classList.remove(CSS_CLASS_NAME);
		const pixelsAsNumber = pixelsStringToNumber(document.body.style.top);
		window.scrollTo(0, pixelsAsNumber);
	};
};

/** An item on the freeze stack. */
export class StackItem
{
	public readonly manager: Manager;
	public readonly id: string;
	constructor({id}: {id: string})
	{
		this.id = id;
	};
	/** Removes the item from the freeze stack. */
	public unstack()
	{
		this.manager.unstack(this.id);
	};
};

function pixelsStringToNumber(string: string)
{
	const matches = string.match(/-?([\d]+)/);
	let numberMatch: string | undefined;
	if (matches)
	{
		numberMatch = matches[1];
	};
	if (!numberMatch)
	{
		throw new ScrollFreezeError({message: 'Failed to extract pixel number from pixel string', code: 'pixelNumberMissing'});
	};
	const number = parseFloat(numberMatch);
	return number;
};

export class ScrollFreezeError extends Error
{
	public code: string;
	constructor({message, code}: {message: string, code: 'pixelNumberMissing'})
	{
		super(message);
		this.code = code;
	};
};