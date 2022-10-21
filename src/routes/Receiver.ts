import { currentEvent, recievers } from './store.js';

export class Receiver {
        private number: number = 0;
        private status: string = 'waiting';
        private freeTime: number = 0;
        private requestSource: number = 0;
        private requestNumber: number = 0;
        private workTime: number = 0;


        constructor(index: number) {
                this.number = index;
        }

        getNumber():number {
                return this.number;
        }

        getStatus():string {
                return this.status;
        }

        getFreeTime():number {
                return this.freeTime;
        }

        getRequestSourse():number {
                return this.requestSource;
        }
        getRequestNumber():number {
                return this.requestNumber;
        }

        getWorkTime():number {
                return this.workTime;
        }

        setRequest(sourceNumber: number, number: number,  lambda: number, sources: Source[], recievers_: Receiver[]) {
                this.status = 'busy';
                this.requestSource = sourceNumber;
                this.requestNumber = number;
                let proccesingTime = this.generateFreeTime(lambda);
                let sources_amount = sources.length;
                for (let index = 0; index < sources_amount; index++) {
                        if (sources.at(index).getNumber == sourceNumber) {
                                sources[index].updateProccesingTime(proccesingTime);
                        }
                }
                let sortedR = recievers_.slice().sort((a, b) => a.freeTime - b.freeTime);
                recievers.set(sortedR);
                currentEvent.set("Заявка от источника "+sourceNumber+" под номером №"+ number+" поставлена на прибор "+this.number);
        }

        generateFreeTime(lambda: number): number {
                let proccesingTime = (Math.log(Math.random() * Number.MAX_SAFE_INTEGER + 1) - Math.log(Number.MAX_SAFE_INTEGER)) / -lambda
                this.freeTime += proccesingTime;
                return proccesingTime;
        }
}
