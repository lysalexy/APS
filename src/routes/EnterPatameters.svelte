<script lang="ts">
	import { buffer, sources, recievers, summaryAmountOfRequests,alfa,beta, lambda, currentEvent} from './store.js';
	import { Button, Row, Col, Input, Label } from 'sveltestrap';
    import {Source} from './Source';
    ///import Source from './Source.svelte';
    import {Receiver} from './Receiver';
    import {Buffer} from './Buffer';
	

	async function doDebug() {
		summaryAmountOfRequests.set(document.getElementById('get_N').value);
		alfa.set(document.getElementById('get_alfa').value);
		beta.set(document.getElementById('get_beta').value);
        lambda.set(document.getElementById('get_lambda').value);
		let source_amount = document.getElementById('get_source_amount').value;
		let reciever_amount = document.getElementById('get_reciever_amount').value;
		let buffer_size = document.getElementById('get_buffer_size').value;
		
		let buf = new Buffer(buffer_size);
	
		buffer.set(buf);

		let sor = [];
		for (let index = 0; index < source_amount; index++) {
            let source = new Source(index+1);
			source.generateNewRequestTime($alfa,$beta);
			sor.push(source);
		}
		sources.set(sor);

		let rec = [];
		for (let index = 0; index < reciever_amount; index++) {
            let receiver = new Receiver(index+1);
            receiver.generateFreeTime($lambda)
			rec.push(receiver);
		}
		recievers.set(rec);
		currentEvent.set("Начало моделирования")

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
			<Label for="get_lambda"><strong>lambda</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_lambda" placeholder="Введите коэффициент при экспоненте во времени обслуживания" />
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
			<Label for="get_buffer_size"><strong>размер буфера</strong></Label>
		</Col>
        <Col sm="6">
			<Input type="number" id="get_buffer_size" placeholder="Введите размер буфера"/>
		</Col>
	</Row>
	<br />
</component>

<Button color="primary" on:click={doDebug}>Установить параметры</Button>
