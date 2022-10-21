<script lang="ts">
	import {currentEvent, mode} from './store.js';
	import EnterParameters from './EnterPatameters.svelte';
	import { Button, Row, Col} from 'sveltestrap';
	import OneStep from './OneStep.svelte';

	function setStepMode(){
		mode.set('step');
		console.log($mode);
	}

</script>

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
	crossorigin="anonymous"
/>
<meta charset="utf-8" />

<body>
	<div id="flex-container">
		<div class="flex-item">
			<EnterParameters />
			<br />
			<br />
			<br />
			<h3><strong>Выберите режим работы</strong></h3>
			<br />
			<Row>
				<Col sm="4">
					<Button color="primary" on:click={setStepMode}>Пошаговый режим</Button>
				</Col>
				<Col sm="6">
					<Button color="primary">Автоматический режим</Button>
				</Col>
			</Row>
			<br />
		</div>
		<div class="flex-item">
			<!-- <h3>{$currentEvent}</h3> -->
			{#if ($mode=='step')}
			<OneStep/>
			{/if}
			{#if ($mode=='mode')}
			<!-- здесь компонент для авторежима -->
			{/if}
			<!-- <h3><strong>Выберите режим работы</strong></h3>
			<h3><strong>{$currentTime}</strong></h3> -->
		</div>
	</div>
</body>

<style>
	#flex-container {
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: row;
		flex-direction: row;
	}

	#flex-container > .flex-item {
		-webkit-flex: auto;
		flex: auto;
		margin-top: 30px;
		margin-left: 60px;
	}
</style>
