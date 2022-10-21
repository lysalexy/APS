<script lang="ts">
	import { buffer, sources, recievers, summaryAmountOfRequests,finishedRequests, alfa,beta,lambda, currentTime, currentEvent,generatedRequests} from './store.js';
	import { Button, Row, Col, Input, Label } from 'sveltestrap';
    import {Source} from './Source';
    ///import Source from './Source.svelte';
    import {Receiver} from './Receiver';
    import {Buffer} from './Buffer';
	import { select_option } from 'svelte/internal';


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
            if ($sources.at(0).genTime < $recievers.at(0).freeTime)//ближайшее событие-генерация новой заявки
            {
                currentTime.set($sources.at(0).genTime);
                $sources.at(0).generateNewRequest($alfa, $beta);
                generatedRequests.update(count=>count+1);
                let recievers_amount = $recievers.length;
                let minimalFreeIndex =-1;
                for (let index = 0; index < sources_amount; index++) {
                    if ($recievers.at(index).getStatus()=='free'){
                        minimalFreeIndex=index;
                        break;
                    }
                }
                if (minimalFreeIndex!=-1)///если есть свободные приёмники
                {///ставим заявку на прибор
                    $recievers.at(minimalFreeIndex).setRequest($sources.at(0).getNumber(), $sources.at(0).getGeneratedRequestsAmount(),$lambda, $sources, $recievers);

                }
                else{///ставим заявку в буфер или получаем отказ в случае его наполненности
                    $buffer.setRequestOrDoResuse($sources.at(0).getNumber(),$sources.at(0).getGeneratedRequestsAmount(),$currentTime,$sources);
                }

            }

        }

		
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
	<h3><strong>Пошаговый режим</strong></h3>
    <br />
    <h4><strong>Время: </strong>{$currentTime}</h4>
    <br />
    <h4><strong>Событие: </strong>{$currentEvent}</h4>

    <Row>
		<Col sm="6">
		</Col>
        <Col sm="3">
			<Button color="primary" on:click={doStep}>Сделать шаг</Button>
		</Col>
	</Row>
	<!-- тут потом выводим таблицы -->
</component>
