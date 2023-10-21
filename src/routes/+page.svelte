<script lang="ts">
	import { db } from './firestore'
	import {
		QuerySnapshot,
		Timestamp,
		addDoc,
		collection,
		limit,
		orderBy,
		type DocumentData,
		endBefore,
		limitToLast,
		startAfter,
		Firestore,
		QueryConstraint,
		query,
		getDocs
	} from 'firebase/firestore'
	import { onMount } from 'svelte'
	import '../app.css'

	type Wordinator = { id: string; name: string }

	const PER_PAGE = 2

	let lessons: QuerySnapshot<DocumentData, DocumentData> | null = null
	let loadedLessons = 0

	const getLessons = async (firestore: Firestore, constraints: QueryConstraint[]) => {
		const q = query(collection(db, 'lessons'), ...constraints)
		const lessons = await getDocs(q)

		return lessons
	}

	const snapshotToLessons = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Wordinator[]
	}

	const submit = async () => {
		await addDoc(collection(db, 'lessons'), {
			name: `lesson-${new Date()}`
		})
	}

	onMount(async () => {
		lessons = await getLessons(db, [orderBy('name', 'desc'), limit(PER_PAGE)])
	})
</script>

<div>
	<form on:submit|preventDefault={submit}>
		<button type="submit"> Add Lesson </button>
	</form>

	<!-- * lessons table -->
	{#if db && lessons}
		<table>
			<thead>
				<tr>
					<th>No.</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				{#each snapshotToLessons(lessons) as { name }, i (i)}
					<tr>
						<td>
							{loadedLessons + i + 1}
						</td>
						<td>
							<p>{name}</p>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="2"> No lessons found. </td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="btn-wrapper">
			<!-- ? prev btn -->
			<button
				disabled={loadedLessons <= 0}
				type="button"
				on:click={async () => {
					const firstDoc = lessons?.docs.at(0)
					if (!firstDoc) return

					lessons = await getLessons(db, [
						orderBy('name', 'desc'),
						endBefore(firstDoc),
						limitToLast(PER_PAGE)
					])

					loadedLessons -= PER_PAGE
				}}
			>
				{'<'}
			</button>

			<!-- ? next btn -->
			<button
				disabled={lessons.docs.length < PER_PAGE}
				type="button"
				on:click={async () => {
					const lastDoc = lessons?.docs.at(-1)
					if (!lastDoc) return

					lessons = await getLessons(db, [
						orderBy('name', 'desc'),
						startAfter(lastDoc),
						limit(PER_PAGE)
					])

					loadedLessons += PER_PAGE
				}}
			>
				{'>'}
			</button>
		</div>
	{:else}
		<div style:text-align="center">Loading...</div>
	{/if}
</div>
