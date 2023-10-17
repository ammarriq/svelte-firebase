<script lang="ts">
	// import { collection, query, type QueryConstraint } from 'firebase/firestore'
	import {
		collection,
		type DocumentData,
		endBefore,
		Firestore,
		getCountFromServer,
		getDocs,
		limit,
		limitToLast,
		query,
		QueryConstraint,
		QuerySnapshot,
		startAfter
	} from 'firebase/firestore'
	import { onMount } from 'svelte'

	import type { Wordinator } from '$lib/types'
	import { db } from '$lib/firebase'

	export let title = ''
	export let baseConstraints: QueryConstraint[]

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

	onMount(async () => {
		lessons = await getLessons(db, [...baseConstraints, limit(PER_PAGE)])
	})
</script>

{#if db && lessons}
	<section class="rounded-2xl border border-slate-700 bg-slate-900">
		<div class="px-6 py-5 sm:flex-row sm:items-center">
			<h2 class="font-semibold uppercase text-white">{title}</h2>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="text-gray-300">
					<tr>
						<th class="w-12 px-6 py-4 text-left text-sm sm:w-32">No.</th>
						<th class="w-32 px-6 py-4 text-left text-sm sm:w-60">Name</th>
						<th class="px-6 py-4 text-left text-sm">Words</th>
					</tr>
				</thead>
				<tbody>
					{#each snapshotToLessons(lessons) as { id, name, wordList }, i (i)}
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
								<td class="h-9" />
								<td class="h-9" />
								<td class="h-9" />
							</tr>
						{/each}
					{:else}
						<tr>
							<td class="py-2 text-center text-sm italic" colspan="3"> No lessons found. </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	{#await getCountFromServer(query(collection(db, 'lessons'), ...baseConstraints))}
		<div
			class="mx-auto h-9 w-20 animate-pulse justify-center
			rounded-full border border-slate-700 bg-slate-900"
		/>
	{:then snapshot}
		<div class="flex justify-center gap-1">
			<button
				class="flex h-9 w-9 items-center justify-center rounded-full
				border border-slate-700 bg-slate-900 disabled:opacity-60"
				disabled={loadedLessons <= 0}
				type="button"
				on:click={async () => {
					const firstDoc = lessons?.docs.at(0)
					if (!firstDoc) return

					lessons = await getLessons(db, [
						...baseConstraints,
						endBefore(firstDoc),
						limitToLast(PER_PAGE)
					])
					loadedLessons -= PER_PAGE
				}}
			>
				{'<'}
			</button>
			<button
				class="flex h-9 w-9 items-center justify-center rounded-full
				border border-slate-700 bg-slate-900 disabled:opacity-60"
				disabled={snapshot.data().count <= loadedLessons + PER_PAGE}
				type="button"
				on:click={async () => {
					const lastDoc = lessons?.docs.at(-1)
					if (!lastDoc) return

					lessons = await getLessons(db, [...baseConstraints, startAfter(lastDoc), limit(PER_PAGE)])
					loadedLessons += PER_PAGE
				}}
			>
				{'>'}
			</button>
		</div>
	{/await}
{:else}
	<div class="absolute inset-0 flex items-center justify-center">
		<i class="icon-[tabler--loader-2] h-12 w-12 animate-spin text-orange-600" />
	</div>
{/if}

<style lang="postcss">
	tr {
		@apply border-t border-slate-700;
	}
</style>
