<script lang="ts">
	import { db } from './utils'
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
		startAfter
	} from 'firebase/firestore'
	import { onMount } from 'svelte'
	import { getLessons, snapshotToLessons } from './utils'

	const PER_PAGE = 2

	let lessons: QuerySnapshot<DocumentData, DocumentData> | null = null
	let loadedLessons = 0
	let words = ''

	const submit = async () => {
		const wordsObj = words
			.split(',')
			.map((word) => word.trim())
			.filter((word) => word.length)

		await addDoc(collection(db, 'lessons'), {
			name: `lesson-${new Date()}`,
			createdOn: Timestamp.now(),
			wordList: wordsObj
		})

		words = ''
	}

	onMount(async () => {
		lessons = await getLessons(db, [orderBy('name', 'desc'), limit(PER_PAGE)])
	})
</script>

<div class="mb-6 space-y-6">
	<form class="flex flex-col gap-4 sm:flex-row" on:submit|preventDefault={submit}>
		<input
			name="words"
			class="border w-full px-4 py-2"
			type="text"
			placeholder="Comma (,) separated words"
			bind:value={words}
		/>
		<button class="w-32 border py-2" type="submit"> Add Word </button>
	</form>

	<div class="overflow-x-auto">
		<!-- * lessons table -->
		{#if db && lessons}
			<table class="w-full">
				<thead>
					<tr>
						<th class="px-6 py-2 text-left text-sm w-32">No.</th>
						<th class="px-6 py-2 text-left text-sm w-60">Name</th>
						<th class="px-6 py-2 text-left text-sm">Words</th>
					</tr>
				</thead>
				<tbody>
					{#each snapshotToLessons(lessons) as { name, wordList }, i (i)}
						<tr>
							<td class="whitespace-nowrap px-6 py-2">
								{loadedLessons + i + 1}
							</td>
							<td class="px-6 py-2">
								<p class="grid"><span class="truncate">{name}</span></p>
							</td>
							<td class="whitespace-nowrap px-6 py-2">
								{wordList.join(', ')}
							</td>
						</tr>
						{#each Array(PER_PAGE - (lessons.docs.length ?? 0)) as _}
							<tr>
								<td class="py-2">&nbsp;</td>
								<td class="py-2">&nbsp;</td>
								<td class="py-2">&nbsp;</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td class="py-2 text-center text-sm italic" colspan="3"> No lessons found. </td>
						</tr>
					{/each}
				</tbody>
			</table>

			<div class="flex justify-center gap-1 mt-4">
				<!-- * prev btn -->
				<button
					class="h-9 w-9 font-bold border disabled:opacity-40"
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

				<!-- * next btn -->
				<button
					class="h-9 w-9 font-bold border disabled:opacity-40"
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
			<div class="text-center">Loading...</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	th,
	td {
		@apply border;
	}
</style>
