<script lang="ts">
	import { buffer, sources, recievers, summaryAmountOfRequests,finishedRequests, alfa,beta,lambda, currentTime, currentEvent,generatedRequests,requestSource,requestNumber} from './store.js';
	import { Button, Row, Col, Table} from 'sveltestrap';
    import {Source} from './Source';
    import {Receiver} from './Receiver';
    import {Buffer} from './Buffer';

    let sourceColumns = ["Номер", "Время генерации следующей заявки", "Всего сгенерировано заявок", "Число отказов"];
    let currentSources =[""];

    let receiverColumns = ["Номер", "Время освобождения прибора", "Текущий статус", "Источник заявки","Номер заявки в источнике"];
    let currentReceivers=[""];

    let bufferColumns = ["Позиция", "Время постановки заявки", "Источник заявки", "Номер заявки в источнике"];
    let currentBuffer=[""];


	export function doStep() {
        if ($finishedRequests>$summaryAmountOfRequests)
        {
            let buf_size = $buffer.length;
            buffer.set(new Buffer(buf_size));
            
            let source_amount = $sources.length;
            let sor = [];
            
            for (let index = 0; index < source_amount; index++) {
                let source = new Source(index+1);
                source.generateNewRequestTime($alfa,$beta);
                sor.push(source);
            }
            
            sources.set(sor);
            
            let reciever_amount = $recievers.length;
            let rec = [];
            
            for (let index = 0; index < reciever_amount; index++) {
                 let receiver = new Receiver(index+1);
                  receiver.generateFreeTime($lambda)
                  rec.push(receiver);
                }
                
                recievers.set(rec);
        }       
        else{
            ///сравниваем занятые источники и занятые приёмники
            //они предварительно уже отсортированы по времени
            let busyReceivers=[];

            for (let index = 0; index < $recievers.length; index++) {
                    if ($recievers.at(index).getStatus()=='busy'){
                      busyReceivers.push($recievers.at(index));
                    }
             }

            if (busyReceivers.length!=0)//есть занятые приёмники
            {
                if ($sources.at(0).genTime < $recievers.at(0).freeTime)//ближайшее событие-генерация новой заявки
                
                {
                    currentTime.set($sources.at(0).getGenTime());///устанавливаем текущее время
                    $sources.at(0).generateNewRequest($alfa, $beta, $sources);
                    let recievers_amount = $recievers.length;
                    let minimalFreeIndex =-1;
                    let recieversSortedSByNumber = $recievers.slice().sort((a, b) => a.getNumber() - b.getNumber());////сортируем приборы по номеру
                    for (let index = 0; index < recievers_amount; index++) {
                        if (recieversSortedSByNumber.at(index).getStatus()=='free'){///берем первый свободный
                            minimalFreeIndex=index;
                            break;
                        }
                    }
                    if (minimalFreeIndex!=-1)///если есть свободные приборы
                    {///ставим заявку на прибоp
                        requestSource.set($sources.at(0).getNumber());
                        requestNumber.set($sources.at(0).getGeneratedRequestsAmount());
                        recieversSortedSByNumber.at(minimalFreeIndex).setRequest($sources.at(0).getNumber(), $sources.at(0).getGeneratedRequestsAmount(),$lambda, $sources, $recievers);
                    }
                    else{///ставим заявку в буфер или получаем отказ в случае его наполненности
                        $buffer.setRequestOrDoResuse($sources.at(0).getNumber(),$sources.at(0).getGeneratedRequestsAmount(),$currentTime,$sources);
                    }
                }
                else{//ближайшее событие-освобождение прибора
                    if ($generatedRequests!=0){
                        finishedRequests.update(count=>count+1);///увеличиваем число обработанных заявок
                    }
                    currentTime.set($recievers.at(0).getFreeTime());
                    if($buffer.hasBusyElements()){///в буфере есть заявки
                        $buffer.getRequest($sources, $generatedRequests, $currentTime);
                        $recievers.at(0).setRequest($requestSource, $requestNumber,  $lambda, $sources, $recievers);
                    }
                     else{//в буфере нет заявок
                        $recievers.at(0).setFreeStatus();
                     }
                }

            }
            else{//ближайшее событие-генерация заявки
                currentTime.set($sources.at(0).getGenTime());///
                $sources.at(0).generateNewRequest($alfa, $beta, $sources);
                let recievers_amount = $recievers.length;
                let minimalFreeIndex =-1;
                let recieversSortedSByNumber = $recievers.slice().sort((a, b) => a.getNumber() - b.getNumber());////сортируем приборы по номеру
                for (let index = 0; index < recievers_amount; index++) {
                    if (recieversSortedSByNumber.at(index).getStatus()=='free'){///берем первый свободный
                        minimalFreeIndex=index;
                        break;
                    }
                }
                if (minimalFreeIndex!=-1)///если есть свободные приборы
                {///ставим заявку на прибоp
                    requestSource.set($sources.at(0).getNumber());
                    requestNumber.set($sources.at(0).getGeneratedRequestsAmount());
                    recieversSortedSByNumber.at(minimalFreeIndex).setRequest($sources.at(0).getNumber(), $sources.at(0).getGeneratedRequestsAmount(),$lambda, $sources, $recievers);
                }
                else{///ставим заявку в буфер или получаем отказ в случае его наполненности
                    $buffer.setRequestOrDoResuse($sources.at(0).getNumber(),$sources.at(0).getGeneratedRequestsAmount(),$currentTime,$sources);
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
        for (let index = 0; index < $buffer.length; index++) {
            let currElem = $buffer.at(index);
            currentReceivers.push([index,currReceiver.getTimeOfPasting(),getSourceNumber(),currElem.getNumber()]);
        }
		// console.log($sources);
		// console.log($recievers);

		
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
