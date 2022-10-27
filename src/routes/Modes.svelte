<script lang="ts">
	import { previousAmountOfRequests, mode, buffer, sources, recievers, summaryAmountOfRequests,finishedRequests, alfa,beta,lambda, currentTime, 
       refusedRequests, previousP, currentEvent,generatedRequests,requestSource,requestNumber, firstSummaryAmountOfRequests} from './store.js';
    import {Source} from './Source';
    import {Receiver} from './Receiver';
    import {Buffer} from './Buffer';
    import { Button, Row, Col, Table} from 'sveltestrap';
	////import Auto from './Auto.svelte';
	///import type { Script } from 'svelte/types/compiler/interfaces.js';
    let startMod=false;

    let sourceColumns = ["Номер", "Время генерации следующей заявки", "Всего сгенерировано заявок", "Число отказов"];
    let currentSources =[""];

    let receiverColumns = ["Номер", "Время освобождения прибора", "Текущий статус", "Источник заявки","Номер заявки в источнике"];
    let currentReceivers=[""];

    let bufferColumns = ["Позиция", "Время постановки заявки", "Источник заявки", "Номер заявки в источнике"];
    let currentBuffer=[""];

    let sourceStatsColumns = ["Номер", "Всего заявок", "Веронятность отклонения заявки", "Среднее время пребывания в системе","Среднее время обслуживания",
"Cреднее время пребывания в буфере", "Дисперсия времени облуживания","Дисперсия времени пребывания в буфере"];
    let sourcesStats =[""];

    let receiverStatsColumns = ["Номер", "Коэффициент использования"];
    let receiversStats=[""];

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
            // if (Number(Number($finishedRequests)+Number($refusedRequests))==Number($summaryAmountOfRequests)){
            //     currentEvent.set("Моделирование закончено. Все заявки сгенерированы и обработаны.");
            // }
            // else{
            //     if ((Number(busyReceivers.length)!=Number(0))){//если есть занятые приборы
            //         freeReciever(busyReceivers);
            //     }
            // }

            if ((Number(busyReceivers.length)!=Number(0))){//если есть занятые приборы
                    freeReciever(busyReceivers);
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
            ////console.log(currElem);
            currentBuffer.push([(index+1), currElem.getTimeOfPasting(), currElem.getSourceNumber(), currElem.getNumber()]);
        }
		 ///console.log($sources);
		// console.log($recievers);
        ///console.log($buffer);
        // console.log($generatedRequests);
        // console.log($summaryAmountOfRequests);
        // console.log($finishedRequests);
        // console.log($refusedRequests);
    }
    export async function doAuto(){
    // if ($mode=='auto'){
        let accuracyAchieved=false;
        let isFirstIteration=true;
        // console.log("inside");
        while(!accuracyAchieved){
           let buf = new Buffer($buffer.getContent().length);
           buffer.set(buf);
            
            let sor = [];
            for (let index = 0; Number(index) < Number($sources.length); index++) {
            let source = new Source(index+1);
			source.generateNewRequestTime($alfa,$beta);
			sor.push(source);}
            
            sources.set(sor);
            
            let rec = [];
            
            for (let index = 0; Number(index) < Number($recievers.length); index++) {
                let receiver = new Receiver(index+1);
                receiver.generateFreeTime($lambda);
                rec.push(receiver);
            }
            recievers.set(rec);

            currentEvent.set("Начало моделирования");

            let sortedR = $recievers.slice().sort((a, b) => a.freeTime - b.freeTime);
            let sortedS = $sources.slice().sort((a, b) => a.genTime - b.genTime);
            
            recievers.set(sortedR);
            sources.set(sortedS);
            currentTime.set(0);
            finishedRequests.set(0);
            generatedRequests.set(0);
            refusedRequests.set(0);
            
            requestSource.set(0);
            requestNumber.set(0);
        while($currentEvent!=="Моделирование закончено. Все заявки сгенерированы и обработаны."){////собираем всю информацию по моделированию
            doStep();
            }

            let refReq=0;
            for (let index = 0; Number(index) < Number($sources.length); index++) {
               refReq=Number(Number(refReq)+Number($sources.at(index).getRefusedRequestsAmount()));
            }

            // console.log(refReq);
            // console.log($sources);
            let currentP=Number(Number(refReq)/Number($summaryAmountOfRequests));
            if (!isFirstIteration){
                if (Number((Math.abs(currentP-$previousP))<Number(0.1))){
                    accuracyAchieved=true;
                    // console.log(currentP);
                    // console.log($previousP);
                }
            }
            else{
                isFirstIteration=false;
                previousP.set(currentP);
            }
            let t = 1.643;
           /// let al = 0.9;
            let b = 0.1;
            let newAmountOfRequests = Number(Number(t)*Number(t)*(1-$previousP))/Number(Number($previousP)*Number(b)*Number(b));
            if(Number(newAmountOfRequests)<Number($previousAmountOfRequests)){
                accuracyAchieved=true;
                console.log('меньше чем до этого');
            }
            if (Number(newAmountOfRequests)>Number(1000000)){
                accuracyAchieved=true;
            }
            // console.log(currentP);
            // console.log($previousP);
            previousP.set(currentP);
            previousAmountOfRequests.set($summaryAmountOfRequests);
            summaryAmountOfRequests.set(Math.round(newAmountOfRequests));
            // console.log($summaryAmountOfRequests);

        }

        ////подсчёт показателей 
        if (Number($firstSummaryAmountOfRequests)>Number($summaryAmountOfRequests))
        {
            summaryAmountOfRequests.set($firstSummaryAmountOfRequests);
           /// console.log('here');
            let buf = new Buffer($buffer.getContent().length);
           buffer.set(buf);
            
            let sor = [];
            for (let index = 0; Number(index) < Number($sources.length); index++) {
            let source = new Source(index+1);
			source.generateNewRequestTime($alfa,$beta);
			sor.push(source);}
            
            sources.set(sor);
            
            let rec = [];
            
            for (let index = 0; Number(index) < Number($recievers.length); index++) {
                let receiver = new Receiver(index+1);
                receiver.generateFreeTime($lambda);
                rec.push(receiver);
            }
            recievers.set(rec);

            currentEvent.set("Начало моделирования");

            let sortedR = $recievers.slice().sort((a, b) => a.freeTime - b.freeTime);
            let sortedS = $sources.slice().sort((a, b) => a.genTime - b.genTime);


            recievers.set(sortedR);
            sources.set(sortedS);
            currentTime.set(0);
            finishedRequests.set(0);
            generatedRequests.set(0);
            refusedRequests.set(0);
            
            requestSource.set(0);
            requestNumber.set(0);

            while($currentEvent!=="Моделирование закончено. Все заявки сгенерированы и обработаны."){////собираем всю информацию по моделированию
                // console.log('1');
            doStep();
            }
            previousAmountOfRequests.set($firstSummaryAmountOfRequests);

        }

        receiversStats=[];
        let sortedRByNumber = $recievers.slice().sort((a, b) => a.getNumber() - b.getNumber());
        for (let index = 0; index < sortedRByNumber.length; index++) {
            let currReceiver = sortedRByNumber.at(index);
            let usability = Number(Number(currReceiver.getWorkTime())/Number($currentTime));
            receiversStats.push([currReceiver.getNumber(), usability]);
        }
        // console.log($recievers);

        sourcesStats=[];
        let sortedSByNumber = $sources.slice().sort((a, b) => a.getNumber() - b.getNumber());
        for (let index = 0; index < sortedSByNumber.length; index++) {
            let currSourse = sortedSByNumber.at(index);
            let sumAmount = currSourse.getGeneratedRequestsAmount();
            let pRef = currSourse.getRefusedRequestsAmount()/sumAmount;

            let summProccesingTime=0;
            for (let index = 0; index < currSourse.getProccessingTime().length; index++) {
                summProccesingTime=Number(Number(currSourse.getProccessingTime().at(index))+Number(summProccesingTime));
            }

            let TObsl;
            if (Number(summProccesingTime)===Number(0)){
                TObsl =0;
            }
            else{
                TObsl = Number(Number(summProccesingTime)/Number(currSourse.getProccessingTime().length));
            }
          

            let summBufferTime=0;
            for (let index = 0; index < currSourse.getBufferTime().length; index++) {
                summBufferTime=Number(Number(currSourse.getBufferTime().at(index))+Number(summBufferTime));
            }
            let TBP;
            if(Number(summBufferTime)===Number(0)){
                TBP=0;
            }
            else{
                TBP= Number(Number(summBufferTime)/Number(currSourse.getBufferTime().length));
            }


            let TPrep= Number(Number(TBP)+Number(TObsl));

            let dispBP=0;
            for (let index = 0; index < currSourse.getBufferTime().length; index++) {
                dispBP=Number((Number(currSourse.getBufferTime().at(index)-TBP)*Number(currSourse.getBufferTime().at(index)-TBP))+Number( dispBP));
            }
            dispBP=Number(Number(dispBP)/Number(currSourse.getBufferTime().length));

            let dispObsl=0;
            for (let index = 0; index < currSourse.getProccessingTime().length; index++) {
                dispObsl=Number((Number(currSourse.getProccessingTime().at(index)-TObsl)*Number(currSourse.getProccessingTime().at(index)-TObsl))+Number(dispObsl));
            }
            dispObsl=Number(Number(dispObsl)/Number(currSourse.getProccessingTime().length));
            


            sourcesStats.push([currSourse.getNumber(),sumAmount, pRef, TPrep, TObsl,TBP,  dispObsl, dispBP]);
        }
        startMod=true;
    }
</script>

<component>
    {#if ($mode=='step')}			
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
      {/if} 


      {#if ($mode=='auto')}
      <h1><strong>Автоматический режим</strong></h1>

      <br />
    <Row>
		<Col sm="6">
		</Col>
        <Col sm="3">
            <Button color="primary" on:click={doAuto}>Выполнить моделирование</Button>
		</Col>
	</Row>
    {#if (startMod==true)}
    <br />
    <h4><strong>Число заявок для доверительной точности 10% </strong>{$previousAmountOfRequests}</h4>
    <br />
    <h4><strong>Общее время реализации: </strong>{$currentTime}</h4>
    <br />


    <h4><strong>Источники </strong></h4>

    <br />
    <Table>
        <tr>
            {#each sourceStatsColumns as column}
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
            {#each receiverStatsColumns as column}
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
    {/if} 
    {/if} 
</component>
