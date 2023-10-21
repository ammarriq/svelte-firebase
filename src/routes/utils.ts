import { db } from '$lib/firebase'
import {
	Firestore,
	QueryConstraint,
	QuerySnapshot,
	collection,
	getDocs,
	query,
	type DocumentData
} from 'firebase/firestore'

type Wordinator = {
	id?: string
	createdOn: Date
	name: string
	uid: string
	wordList: string[]
	archive: boolean
}

export const getLessons = async (firestore: Firestore, constraints: QueryConstraint[]) => {
	const q = query(collection(db, 'lessons'), ...constraints)
	const lessons = await getDocs(q)

	return lessons
}

export const snapshotToLessons = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Wordinator[]
}
