export class Drawing {
	gif: boolean;
	data: Array<Array<string>>;

	constructor(data: Array<Array<string>>, gif = false) {
		this.gif = gif;
		this.data = data;
	}
}
