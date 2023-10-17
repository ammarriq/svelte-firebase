<script lang="ts">
	import { orderBy } from 'firebase/firestore'
	import WordForm from '$lib/components/WordForm.svelte'
	import Lessons from '$lib/components/Lessons.svelte'
</script>

<hgroup
	class="relative flex h-20 flex-col items-center
	justify-center gap-y-2 md:flex-row"
>
	<h2 class="text-2xl font-semibold tracking-wide text-white md:text-4xl">Wordinator</h2>
</hgroup>

<div class="mb-6 space-y-6">
	<WordForm />
	<Lessons baseConstraints={[orderBy('name', 'desc')]} title="My Lessons" />
</div>
