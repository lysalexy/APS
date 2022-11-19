<script lang="ts">
	import {mode} from './store.js';
	import EnterParameters from './EnterPatameters.svelte';
	import { Button, Row, Col} from 'sveltestrap';
	import Modes from './Modes.svelte';

	function setStepMode(){
		mode.set('step');
		console.log($mode);
	}

	function setAutoMode(){
		mode.set('auto');
		console.log($mode);
		// {doAuto};
	}
	function setOptimalMode(){
		mode.set('optimal');
	}

</script>

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
					<Button color="primary" on:click={setAutoMode}>Автоматический режим</Button>
				</Col>
				<Col sm="2">
					<Button color="primary" on:click={setOptimalMode}>Оптимальная конфигурация</Button>
				</Col>
			</Row>
			<br />
		</div>
		<div class="flex-item">
			<Modes/>
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
