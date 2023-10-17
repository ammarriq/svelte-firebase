export type Wordinator = {
	id?: string;
	createdOn: Date;
	name: string;
	uid: string;
	wordList: Word[];
	archive: boolean;
};

export type Word = {
	text: string;
};
