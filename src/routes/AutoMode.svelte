<!-- <script lang="ts">
    import{previousN, currentTime, currentEvent} from './store.js';
    import { Button, Row, Col, Table} from 'sveltestrap';
    import {doStep} from './OneStep.svelte';

    while($currentEvent!="Моделирование закончено. Все заявки сгенерированы и обработаны."){
        {doStep};
    }

    
    let sourceColumns = ["Номер", "Всего сгенерировано заявок", "Вероятность отклонения заявки", "Среднее время пребывания заявки в системе","Среднее время обслуживания заявки",
"Cреднее время пребывания заявки в буфере", "Дисперсия времени облуживания","Дисперсия времени пребывания в буфере"];
    let sourcesStats =[""];

    let receiverColumns = ["Номер", "Коэффициент использования"];
    let receiversStats=[""];

</script>

<component>
	<h1><strong>Автоматический режим</strong></h1>
    <br />
    <h4><strong>Число заявок для доверительной точности 10% </strong>{$previousN}</h4>
    <br />
    <h4><strong>Общее время реализации: </strong>{$currentTime}</h4>
    <br />


    <h4><strong>Источники </strong></h4>

    <br />
    <Table>
        <tr>
            {#each sourceColumns as column}
                <th>{column}</th>
            {/each}
        </tr>

        {#each sourcesStats as row}
		<tr>
			{#each row as cell}
			<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
		</tr>
        {/each}
        
      </Table>
    <br />
    
    <br />
    <h4><strong>Приборы </strong></h4>
    <Table>
        <tr>
            {#each receiverColumns as column}
                <th>{column}</th>
            {/each}
        </tr>

        {#each receiversStats as row}
		<tr>
			{#each row as cell}
			<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
		</tr>
        {/each}        
      </Table>
    <br />

</component> -->
