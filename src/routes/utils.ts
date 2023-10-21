import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public'
import { initializeApp } from 'firebase/app'
import {
	Firestore,
	QueryConstraint,
	QuerySnapshot,
	collection,
	getDocs,
	query,
	type DocumentData,
	getFirestore
} from 'firebase/firestore'

type Wordinator = {
	id?: string
	createdOn: Date
	name: string
	uid: string
	wordList: string[]
	archive: boolean
}

const app = initializeApp(JSON.parse(PUBLIC_FIREBASE_CONFIG))

export const db = getFirestore(app)

export const getLessons = async (firestore: Firestore, constraints: QueryConstraint[]) => {
	const q = query(collection(db, 'lessons'), ...constraints)
	const lessons = await getDocs(q)

	return lessons
}

export const snapshotToLessons = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Wordinator[]
}
