'use strict';

// Types
interface Stack extends Map<string, ScrollFreezeStackItem> {};

// Constants
const CSS_CLASS_NAME = 'scroll-freeze-module-active';

/** Manages a stack of requests for the DOM <body> to be unscrollable. */
export class ScrollFreezeManager
{
	private readonly stackMap: Stack = new Map();
	private stackCount = 0;
	private readonly cssClassName: string;
	constructor()
	{
		this.cssClassName = this.generateCssClassName();
		this.insertCssRule();
	};
	/** Inserts rule into CSS stylesheet which will be used later to freeze scrolling. */
	private insertCssRule()
	{
		const styleElement = document.createElement('style');
		styleElement.classList.add(this.cssClassName);
		document.head.insertBefore(styleElement, document.head.children[0]);
		const stylesheet = Array.from(document.styleSheets).find(stylesheet => stylesheet.ownerNode === styleElement) as CSSStyleSheet;
		const cssClass = this.generateCssClass();
		stylesheet.insertRule(cssClass, 0);
	};
	/** Generates CSS class name. */
	private generateCssClassName()
	{
		const name = `${CSS_CLASS_NAME}`;
		return name;
	};
	/** Generates CSS class. */
	private generateCssClass()
	{
		const rule =
		`
			html.${this.cssClassName} > body
			{
				position: fixed;
				overflow-y: unset;
			}
		`;
		return rule;
	};
	/** Adds to the freeze stack. */
	public stack()
	{
		const item = new ScrollFreezeStackItem({id: this.stackCount.toString(), manager: this});
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
		document.documentElement.classList.add(this.cssClassName);
	};
	/** Removes from freeze stack. */
	public unstack(item: string | ScrollFreezeStackItem)
	{
		const id = typeof item === 'string' ? item : item.id;
		this.stackMap.delete(id);
		if (this.stackMap.size === 0)
		{
			this.unfreeze();
		};
	};
	/** Removes all items from stack and unfreezes body. */
	public clear()
	{
		this.stackMap.clear();
		this.unfreeze();
	};
	/** Unfreezes body. */
	private unfreeze()
	{
		document.documentElement.classList.remove(this.cssClassName);
		const pixelsAsNumber = pixelsStringToNumber(document.body.style.top);
		window.scrollTo(0, pixelsAsNumber);
	};
};

/** An item on the freeze stack. */
export class ScrollFreezeStackItem
{
	public readonly manager: ScrollFreezeManager;
	public readonly id: string;
	constructor({id, manager}: {id: string, manager: ScrollFreezeManager})
	{
		this.id = id;
		this.manager = manager;
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