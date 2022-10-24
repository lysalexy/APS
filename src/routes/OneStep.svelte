<!-- <script context="module">
    import { get } from 'svelte/store';
    import { buffer, sources, recievers, summaryAmountOfRequests,finishedRequests, alfa,beta,lambda, currentTime, currentEvent,generatedRequests,requestSource,requestNumber} from './store.js';

    import {sourcesForStepMode,recieversForStepMode,bufferForStepMode} from "./store"
	// import Source from './Source.svelte';
   
    let currentSources =[""];

    let currentReceivers=[""];

    let currentBuffer=[""];

    let allSources = get(sources);
    let allRecievers=get(recievers);
    let allBuffer=get(buffer);

    let firstSource = allSources.at(0);

    function generateRequest(busyReceivers){
        // let allSources = get(sources);
        // let firstSource = get(sources).at(0);

        // let allRecievers=get(recievers);

        currentTime.set(firstSource.getGenTime());///устанавливаем текущее время
        firstSource.generateNewRequest(get(alfa), get(beta),allSources);
                    
        let recieversSortedSByNumber = allRecievers.slice().sort((a, b) => a.getNumber() - b.getNumber());////сортируем приборы по номеру
                    
        if (busyReceivers.length==allRecievers.length){///если нет свободных приборов, ставим заявку в буфер или получаем отказ в случае его наполненности
             allBuffer.setRequestOrDoResuse(firstSource.getNumber(),firstSource.getGeneratedRequestsAmount(),get(currentTime),allSources);
        }
        else{///если есть свободные приборы, ставим заявку на прибоp
            let minimalFreeIndex =-1;
            let recieversSortedSByNumber = allRecievers.slice().sort((a, b) => a.getNumber() - b.getNumber());////сортируем приборы по номеру
            for (let index = 0; index < recieversSortedSByNumber.length; index++) {
                if (recieversSortedSByNumber.at(index).getStatus()=='free'){///берем первый свободный
                    minimalFreeIndex=index;
                    break;
                }
            }
            requestSource.set(firstSource.getNumber());
            requestNumber.set(firstSource.getGeneratedRequestsAmount());
            recieversSortedSByNumber.at(minimalFreeIndex).setRequest(firstSource.getNumber(), firstSource.getGeneratedRequestsAmount(),get(lambda), allSources, allRecievers,get(currentTime));
                    
            let sortedR = allRecievers.slice().sort((a, b) => a.freeTime - b.freeTime);
            recievers.set(sortedR);

            }
            let sortedS = allSources.slice().sort((a, b) => a.genTime - b.genTime);
            sources.set(sortedS);
    }

    function freeReciever(busyReceivers){
        finishedRequests.update(count=>count+1);///увеличиваем число обработанных заявок
                
        currentTime.set(busyReceivers.at(0).getFreeTime());///текущее время-время освобождения приёмника

        let all

        if(allBuffer.hasBusyElements()){///в буфере есть заявки
            allBuffer.getRequest(allSources, get(generatedRequests), get(currentTime));///получаем заявку из буфера
            busyReceivers.at(0).setRequest(get(requestSource), get(requestNumber),  get(lambda), allSources, allRecievers,get(currentTime));///ставим заявку на освободившийся прибор
            let sortedR = allRecievers.slice().sort((a, b) => a.freeTime - b.freeTime);
            recievers.set(sortedR);
        }
        else{//в буфере нет заявок
            busyReceivers.at(0).setFreeStatus();
        }
    }

	export function doStep() {
        let busyReceivers=[];
        for (let index = 0; index < allRecievers.length; index++) {
            if (allRecievers.at(index).getStatus()=='busy'){
                 busyReceivers.push(allRecievers.at(index));
                 }
        }

        if (get(generatedRequests)==get(summaryAmountOfRequests))///заканчиваем генерацию заявок
        {
            ///поменять время генерации след заявки во всех источниках на -
            if (get(finishedRequests)<get(summaryAmountOfRequests)){
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
                if (firstSource.genTime < busyReceivers.at(0).freeTime){//ближайшее событие-генерация новой заявки
                    generateRequest(busyReceivers);
                }
                else{//ближайшее событие-освобождение прибора
                    freeReciever(busyReceivers);
                }
           }
        }

        ////currentSources=[];
        let sortedSByNumber = allSources.slice().sort((a, b) => a.getNumber() - b.getNumber());
        for (let index = 0; index < sortedSByNumber.length; index++) {
            let currSourse = sortedSByNumber.at(index);
            currentSources.push([currSourse.getNumber(),currSourse.getGenTime(),currSourse.getGeneratedRequestsAmount(),currSourse.getRefusedRequestsAmount()]);
        }
        sourcesForStepMode.set(currentSources);

        currentReceivers=[];
        let sortedRByNumber = allRecievers.slice().sort((a, b) => a.getNumber() - b.getNumber());
        for (let index = 0; index < sortedRByNumber.length; index++) {
            let currReceiver = sortedRByNumber.at(index);
            currentReceivers.push([currReceiver.getNumber(),currReceiver.getFreeTime(),currReceiver.getStatus(),currReceiver.getRequestSource(), currReceiver.getRequestNumber()]);
        }
        recieversForStepMode.set(currentReceivers);

        currentBuffer=[];
        for (let index = 0; index < allBuffer.getContent().length; index++) {
            let currElem = allBuffer.getContent().at(index);
            console.log(currElem);
            currentBuffer.push([(index+1), currElem.getTimeOfPasting(), currElem.getSourceNumber(), currElem.getNumber()]);
        }
        bufferForStepMode.set(currentBuffer);
		// console.log($sources);
		// console.log($recievers);
        // console.log($buffer);

        console.log(get(sourcesForStepMode));
        console.log(currentSources);

    }
</script> -->