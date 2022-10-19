<script>
	import { buffer, sources, recievers } from './store.js';
	import { Button } from 'sveltestrap';
	import { compute_slots } from 'svelte/internal';

	async function doDebug() {
		let n = document.getElementById('get_N').value;
		let alfa = document.getElementById('get_alfa').value;
		let beta = document.getElementById('get_beta').value;
		let source_amount = document.getElementById('get_source_amount').value;
		let reciever_amount = document.getElementById('get_reciever_amount').value;
		let buffer_size = document.getElementById('get_buffer_size').value;
		let number = 0;

		let buf = [];
		for (let index = 0; index < buffer_size; index++) {
			let elem = {
				sourceNumber: 0,
				number: 0,
				status: 'free'
			};
			buf.push(elem);
			number = number + 1;
		}
		buffer.set(buf);

		let sor = [];
		for (let index = 0; index < source_amount; index++) {
			let source = {
				number: 0,
				status: 'waiting',
				genTime: index, // генерируем для источника время по нужному закону
				bufTime: 0,
				refusalTime: 0,
				reqNumber: 0
			};
			sor.push(source);
			number = number + 1;
		}
		sources.set(sor);

		let rec = [];
		for (let index = 0; index < reciever_amount; index++) {
			let reciever = {
				number: 0,
				status: 'waiting',
				freeTime: 100 - index, // генерируем для приёмника время по нужному закону
				reqNumber: 0,
				workTime: 0
			};
			rec.push(reciever);
			number = number + 1;
		}
		recievers.set(rec);

		// console.log($buffer);
		// console.log($sources);
		// console.log($recievers);
		let sortedR = $recievers.slice().sort((a, b) => a.freeTime - b.freeTime);
		let sortedS = $sources.slice().sort((a, b) => a.genTime - b.genTime);
		recievers.set(sortedR);
		sources.set(sortedS);
	}
</script>

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
	crossorigin="anonymous"
/>
<meta charset="utf-8" />

<component>
	<h3><strong>Введите параметры системы</strong></h3>
	<br />
	<div class="mb-3 row">
		<label for="get_N" class="col-sm-1 col-form-label"> <strong>N</strong></label>
		<div class="col-sm-4">
			<input type="number" class="form-control" placeholder="Введите число заявок" id="get_N" />
		</div>
	</div>
	<br />

	<div class="mb-3 row">
		<label for="get_alfa" class="col-sm-1 col-form-label"> <strong>alfa</strong></label>
		<div class="col-sm-4">
			<input
				type="number"
				class="form-control"
				placeholder="Введите минимальное время генерации заявки"
				id="get_alfa"
			/>
		</div>
	</div>
	<br />

	<div class="mb-3 row">
		<label for="get_beta" class="col-sm-1 col-form-label"> <strong>beta</strong></label>
		<div class="col-sm-4">
			<input
				type="number"
				class="form-control"
				placeholder="Введите максимальное время генерации заявки"
				id="get_beta"
			/>
		</div>
	</div>
	<br />

	<div class="mb-3 row">
		<label for="get_source_amount" class="col-sm-1 col-form-label">
			<strong>число источников</strong></label
		>
		<div class="col-sm-4">
			<input
				type="number"
				class="form-control"
				placeholder="Введите число источников"
				id="get_source_amount"
			/>
		</div>
	</div>
	<br />

	<div class="mb-3 row">
		<label for="get_reciever_amount" class="col-sm-1 col-form-label">
			<strong>число приёмников</strong></label
		>
		<div class="col-sm-4">
			<input
				type="number"
				class="form-control"
				placeholder="Введите число приёмников"
				id="get_reciever_amount"
			/>
		</div>
	</div>
	<br />

	<div class="mb-3 row">
		<label for="get_buffer_size" class="col-sm-1 col-form-label">
			<strong>размер буфера</strong></label
		>
		<div class="col-sm-4">
			<input
				type="number"
				class="form-control"
				placeholder="Введите размер буфера"
				id="get_buffer_size"
			/>
		</div>
	</div>
	<br />

</component>

<Button color="primary" on:click={doDebug}>Установить параметры</Button>
