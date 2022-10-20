<script>
	import { buffer, sources, recievers } from './store.js';
	import { Button, Row, Col, Input, Label } from 'sveltestrap';

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
				status: 'free',
				timeOfPasting: 0
			};
			buf.push(elem);
			number = number + 1;
		}
		buffer.set(buf);

		let sor = [];
		for (let index = 0; index < source_amount; index++) {
			let source = {
				number: 0,
				genTime: index, // генерируем для источника время по нужному закону
				bufFerTime: 0,
				refusalTime: 0,
				generatedRequestsAmount: 0
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
				requestSource: 0,
				requestNumber: 0,
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

	<Row>
		<Col sm="3">
			<Label for="get_N"><strong>N</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_N" placeholder="Введите число заявок" />
		</Col>
	</Row>
	<br />

    <Row>
		<Col sm="3">
			<Label for="get_alfa"><strong>alfa</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_alfa" placeholder="Введите минимальное время генерации заявки" />
		</Col>
	</Row>
	<br />

    
    <Row>
		<Col sm="3">
			<Label for="get_beta"><strong>beta</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_beta" placeholder="Введите максимальное время генерации заявки"/>
		</Col>
	</Row>

	<br />
    <Row>
		<Col sm="3">
			<Label for="get_source_amount"><strong>число источников</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_source_amount" placeholder="Введите число источников"/>
		</Col>
	</Row>

	<br />

    <Row>
		<Col sm="3">
			<Label for="get_reciever_amount"><strong>число приёмников</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_reciever_amount" placeholder="Введите число приёмников"/>
		</Col>
	</Row>

	<br />

    <Row>
		<Col sm="3">
			<Label for="get_buffer_size"><strong>число приёмников</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_buffer_size" placeholder="Введите размер буфера"/>
		</Col>
	</Row>
	<br />
</component>

<Button color="primary" on:click={doDebug}>Установить параметры</Button>
