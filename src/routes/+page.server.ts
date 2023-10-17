import { db } from '$lib/firebase.server'
import { Timestamp } from 'firebase-admin/firestore'

export const actions = {
	add_lesson: async ({ request }) => {
		const formData = await request.formData()
		const words = (formData.get('words') as string) ?? ''

		const wordsObj = await Promise.all(
			words
				.split(',')
				.map((word) => word.trim())
				.filter((word) => word.length)
		)

		const wordinator = {
			name: `lesson-${new Date()}`,
			createdOn: Timestamp.now(),
			wordList: wordsObj,
			archive: false
		}

		await db.collection('lessons').add(wordinator)

		return { success: true }
	}
}
