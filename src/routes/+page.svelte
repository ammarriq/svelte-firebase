<script lang="ts">
	import {
		QuerySnapshot,
		addDoc,
		collection,
		limit,
		orderBy,
		type DocumentData,
		endBefore,
		limitToLast,
		startAfter,
		QueryConstraint,
		query,
		getDocs
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import '../app.css';
	import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';
	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';

	const app = initializeApp(JSON.parse(PUBLIC_FIREBASE_CONFIG));
	const firestore = getFirestore(app);
	const collectionName = 'foobar';
	const collectionRef = collection(firestore, collectionName);

	const ITEM_PER_PAGE = 2;

	let snapshot: QuerySnapshot<DocumentData, DocumentData> | null = null;
	let documentCount = 0;

	const updateContraints = async (constraints: QueryConstraint[]) => {
		snapshot = await getDocs(query(collectionRef, ...constraints));
	};

	const snapshotObject = () => {
		if (!snapshot) return [];
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as {
			id: string;
			name: string;
		}[];
	};

	onMount(async () => {
		updateContraints([orderBy('name', 'desc'), limit(ITEM_PER_PAGE)]);
	});
</script>

<div>
	{Intl.DateTimeFormat().resolvedOptions().timeZone}

	<!-- add form -->
	<form on:submit|preventDefault={() => addDoc(collectionRef, { name: new Date() })}>
		<button type="submit">Add Lesson</button>
	</form>

	{#if firestore && snapshot}
		<!-- * table -->
		<table>
			<thead>
				<tr>
					<th>No.</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				{#each snapshotObject() as { id, name }, i (id)}
					<tr>
						<td>{documentCount + i + 1} </td>
						<td>{name}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="2">No data</td>
					</tr>
				{/each}
				{#each Array(2 - snapshot.docs.length) as _, i (i)}
					<tr>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div>
			<!-- ? prev btn -->
			<button
				disabled={documentCount <= 0}
				type="button"
				on:click={async () => {
					const firstDoc = snapshot?.docs.at(0);
					if (!firstDoc) return;

					await updateContraints([
						orderBy('name', 'desc'),
						endBefore(firstDoc),
						limitToLast(ITEM_PER_PAGE)
					]);

					documentCount -= ITEM_PER_PAGE;
				}}
			>
				{'<'}
			</button>

			<!-- ? next btn -->
			<button
				disabled={snapshot.docs.length < ITEM_PER_PAGE}
				type="button"
				on:click={async () => {
					const lastDoc = snapshot?.docs.at(-1);
					if (!lastDoc) return;

					await updateContraints([
						orderBy('name', 'desc'),
						startAfter(lastDoc),
						limit(ITEM_PER_PAGE)
					]);

					documentCount += ITEM_PER_PAGE;
				}}
			>
				{'>'}
			</button>
		</div>
	{:else}
		<div style:text-align="center">Loading...</div>
	{/if}
</div>
