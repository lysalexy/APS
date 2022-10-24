<script lang="ts">
	import { buffer, sources, recievers, summaryAmountOfRequests,finishedRequests, alfa,beta,lambda, currentTime, currentEvent,generatedRequests,requestSource,requestNumber} from './store.js';
	import {sourcesForStepMode,recieversForStepMode,bufferForStepMode} from "./store"
    import { Button, Row, Col, Table} from 'sveltestrap';
    ///import {doStep} from "./OneStep.svelte";

    let sourceColumns = ["Номер", "Время генерации следующей заявки", "Всего сгенерировано заявок", "Число отказов"];
    let currentSources =[""];

    let receiverColumns = ["Номер", "Время освобождения прибора", "Текущий статус", "Источник заявки","Номер заявки в источнике"];
    let currentReceivers=[""];

    let bufferColumns = ["Позиция", "Время постановки заявки", "Источник заявки", "Номер заявки в источнике"];
    let currentBuffer=[""];

    function generateRequest(busyReceivers){
        currentTime.set($sources.at(0).getGenTime());///устанавливаем текущее время
                $sources.at(0).generateNewRequest($alfa, $beta, $sources);
                    
                let recieversSortedSByNumber = $recievers.slice().sort((a, b) => a.getNumber() - b.getNumber());////сортируем приборы по номеру
                    
                if (busyReceivers.length==$recievers.length){///если нет свободных приборов, ставим заявку в буфер или получаем отказ в случае его наполненности
                    $buffer.setRequestOrDoResuse($sources.at(0).getNumber(),$sources.at(0).getGeneratedRequestsAmount(),$currentTime,$sources);
                }
                 else{///если есть свободные приборы, ставим заявку на прибоp
                    let minimalFreeIndex =-1;
                    let recieversSortedSByNumber = $recievers.slice().sort((a, b) => a.getNumber() - b.getNumber());////сортируем приборы по номеру
                    for (let index = 0; index < recieversSortedSByNumber.length; index++) {
                        if (recieversSortedSByNumber.at(index).getStatus()=='free'){///берем первый свободный
                              minimalFreeIndex=index;
                            break;
                        }
                    }
                    requestSource.set($sources.at(0).getNumber());
                    requestNumber.set($sources.at(0).getGeneratedRequestsAmount());
                    recieversSortedSByNumber.at(minimalFreeIndex).setRequest($sources.at(0).getNumber(), $sources.at(0).getGeneratedRequestsAmount(),$lambda, $sources, $recievers,$currentTime);
                    
                    let sortedR = $recievers.slice().sort((a, b) => a.freeTime - b.freeTime);
                    recievers.set(sortedR);

                    }
                    let sortedS = $sources.slice().sort((a, b) => a.genTime - b.genTime);
                    sources.set(sortedS);
    }

    function freeReciever(busyReceivers){
        finishedRequests.update(count=>count+1);///увеличиваем число обработанных заявок
                
        currentTime.set(busyReceivers.at(0).getFreeTime());///текущее время-время освобождения приёмника

        if($buffer.hasBusyElements()){///в буфере есть заявки
            $buffer.getRequest($sources, $generatedRequests, $currentTime);///получаем заявку из буфера
            busyReceivers.at(0).setRequest($requestSource, $requestNumber,  $lambda, $sources, $recievers,$currentTime);///ставим заявку на освободившийся прибор
            let sortedR = $recievers.slice().sort((a, b) => a.freeTime - b.freeTime);
            recievers.set(sortedR);
        }
        else{//в буфере нет заявок
            busyReceivers.at(0).setFreeStatus();
        }
    }

	export function doStep() {
        let busyReceivers=[];
        for (let index = 0; index < $recievers.length; index++) {
            if ($recievers.at(index).getStatus()=='busy'){
                 busyReceivers.push($recievers.at(index));
                 }
        }

        if ($generatedRequests==$summaryAmountOfRequests)///заканчиваем генерацию заявок
        {
            ///поменять время генерации след заявки во всех источниках на -
            if ($finishedRequests<$summaryAmountOfRequests){
                if ((Number(busyReceivers.length)!=Number(0))){//если есть занятые приборы
                    freeReciever(busyReceivers);
                }
            }
            else{
                currentEvent.set("Моделирование закончено. Все заявки сгенерированы и обработаны.");
            }
        }       
        else{
            if (Number(busyReceivers.length)==Number(0))//если нет занятых приборов
            {
                //ближайшее событие-генерация новой заявки
                generateRequest(busyReceivers);

            }
            else{//есть занятые приборы
                if ($sources.at(0).genTime < busyReceivers.at(0).freeTime){//ближайшее событие-генерация новой заявки
                    generateRequest(busyReceivers);
                }
                else{//ближайшее событие-освобождение прибора
                    freeReciever(busyReceivers);
                }
           }
        }

    currentSources=[];
        let sortedSByNumber = $sources.slice().sort((a, b) => a.getNumber() - b.getNumber());
        for (let index = 0; index < sortedSByNumber.length; index++) {
            let currSourse = sortedSByNumber.at(index);
            currentSources.push([currSourse.getNumber(),currSourse.getGenTime(),currSourse.getGeneratedRequestsAmount(),currSourse.getRefusedRequestsAmount()]);
        }

    currentReceivers=[];
        let sortedRByNumber = $recievers.slice().sort((a, b) => a.getNumber() - b.getNumber());
        for (let index = 0; index < sortedRByNumber.length; index++) {
            let currReceiver = sortedRByNumber.at(index);
            currentReceivers.push([currReceiver.getNumber(),currReceiver.getFreeTime(),currReceiver.getStatus(),currReceiver.getRequestSource(), currReceiver.getRequestNumber()]);
        }

    currentBuffer=[];
        for (let index = 0; index < $buffer.getContent().length; index++) {
            let currElem = $buffer.getContent().at(index);
            console.log(currElem);
            currentBuffer.push([(index+1), currElem.getTimeOfPasting(), currElem.getSourceNumber(), currElem.getNumber()]);
        }
		console.log($sources);
		console.log($recievers);
        console.log($buffer);
        console.log($generatedRequests);
        console.log($summaryAmountOfRequests);
        console.log($finishedRequests);
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
	<h1><strong>Пошаговый режим</strong></h1>
    <br />
    <h4><strong>Время: </strong>{$currentTime}</h4>
    <br />
    <h4><strong>Событие: </strong>{$currentEvent}</h4>
    <br />
    <Row>
		<Col sm="6">
		</Col>
        <Col sm="3">
			<!-- <Button color="primary" on:click={doStep}>Сделать шаг</Button> -->
            <Button color="primary" on:click={doStep}>Сделать шаг</Button>
		</Col>
	</Row>

    <h4><strong>Источники </strong></h4>

    <br />
    <Table>
        <tr>
            {#each sourceColumns as column}
                <th>{column}</th>
            {/each}
        </tr>

        {#each currentSources as row}
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

        {#each currentReceivers as row}
		<tr>
			{#each row as cell}
			<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
		</tr>
        {/each}
        
      </Table>
    <br />

    <br />
    <h4><strong>Буфер</strong></h4>
    <Table>
        <tr>
            {#each bufferColumns as column}
                <th>{column}</th>
            {/each}
        </tr>

        {#each currentBuffer as row}
		<tr>
			{#each row as cell}
			<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
		</tr>
        {/each}
        
      </Table>
</component>
