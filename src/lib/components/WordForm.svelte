<script lang="ts">
	import { enhance } from '$app/forms'
</script>

<form
	class="flex flex-col gap-4 sm:flex-row"
	enctype="multipart/form-data"
	method="post"
	action="?/add_lesson"
	use:enhance
>
	<input
		name="words"
		class="w-full rounded-full border border-slate-700
		bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500"
		placeholder="Add multiple words by separating them with a comma(,), works best with 8 words or less."
		type="text"
	/>

	<div class="flex">
		<button
			class="flex w-32 items-center justify-center whitespace-nowrap
			rounded-full border border-slate-700 bg-slate-900 py-2
			text-sm text-white hover:bg-slate-900/40 disabled:bg-slate-900/40"
			type="submit"
		>
			Add Word
		</button>
	</div>
</form>
