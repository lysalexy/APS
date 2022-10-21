import { buffer, currentEvent } from './store.js';
import type { Source } from './Source';

class BufferElem {
    private sourceNumber: number = 0;
    private number: number = 0;
    private status: string = 'free';
    private timeOfPasting: number = 0;

    get getStatus() {
        return this.status;
    }

    setRequest(sourceNumber: number, number: number, timeOfPasting: number) {
        this.sourceNumber = sourceNumber;
        this.number = number;
        this.status = 'busy';
        this.timeOfPasting = timeOfPasting;
    }
}

export class Buffer {
    private elements: BufferElem[] = [];

    constructor(size: number) {
        for (let index = 0; index < size; index++) {
            this.elements.push(new BufferElem);
        }
    }

    setRequestOrDoResuse(sourceNumber: number, number: number, timeOfPasting: number, sources: Source[]): Source[] {
        let minimalInd = -1;
        for (let index = 0; index < this.elements.length; index++) {
            if (this.elements.at(index).getStatus == 'free') {
                minimalInd = index;
                break;
            }
        }
        if (minimalInd != -1) {
            this.elements.at(minimalInd).setRequest(sourceNumber, number, timeOfPasting);
            currentEvent.set("Заявке от источника " + sourceNumber.valueOf + "с порядковый номером " + number.valueOf + "было отказано в обслуживании");
            buffer.set(this);

        }
        else {
            for (let index = 0; index < this.elements.length; index++) {
                if (sources.at(index).getNumber == sourceNumber) {
                    sources[index].refuseRequest();
                }
            }
        }
        return sources;////обновлять sources этим значением после выполнения метода
    }
}


