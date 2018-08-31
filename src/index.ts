'use strict';

// Types
interface Stack extends Map<string, StackItem> {};

// Constants
const CSS_CLASS_NAME = 'bluecewe-scroll-freeze';
const cssClass =
`
	html.{$CSS_CLASS_NAME} > body
	{
		position: fixed;
	}
`;

/** Manages a stack of requests for the DOM <body> to be unscrollable. */
class Manager
{
	private stackMap: Stack = new Map();
	private stackCount = 0;
	constructor()
	{
		const styleElement = document.createElement('style');
		styleElement.classList.add(CSS_CLASS_NAME);
		document.head.insertBefore(styleElement, document.head.children[0]);
		const stylesheet = Array.from(document.styleSheets).find(stylesheet => stylesheet.ownerNode === styleElement) as CSSStyleSheet;
		stylesheet.insertRule(cssClass, 0);
	};
	/** Adds to the freeze stack. */
	public stack()
	{
		const item = new StackItem(this.stackCount.toString());
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
	public id: string;
	constructor(id: string)
	{
		this.initialiseProperties(id);
	};
	private initialiseProperties(id: string)
	{
		this.id = id;
	};
	/** Removes the item from the freeze stack. */
	public unstack()
	{
		instance.unstack(this.id);
	};
};

function pixelsStringToNumber(string: string)
{
	const matches = string.match(/-?([\d]+)/);
	let numberMatch = null;
	if (matches)
	{
		numberMatch = matches[1];
	};
	if (!numberMatch)
	{
		ScrollFreezeError.throw({message: '[Pixels String To Number] No number found.', code: 'missing'});
	};
	const number = parseFloat(numberMatch);
	return number;
};

export class ScrollFreezeError extends Error
{
	public code: string;
	static throw(parameters: ErrorParameters)
	{
		throw new this(parameters);
	};
	constructor(parameters: ErrorParameters)
	{
		super(parameters.message);
		this.code = parameters.code;
	};
};

interface ErrorParameters
{
	message: string;
	code: string;
};

const instance = new Manager();
export default instance;