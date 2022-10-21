<script lang="ts">
    export class Source {
	private number: number = 0;
	private genTime: number = 0;
	private bufferTime: number = 0;
	private refusalTime: number = 0;
	private resusedRequestsAmount: number = 0;
	private generatedRequestsAmount: number = 0;


	constructor(index: number) {
		this.number = index;
		this.genTime = 0.0;
		this.bufferTime = 0;
		this.refusalTime = 0;
		this.generatedRequestsAmount = 0;
	}

	get getNumber() {
		return this.number;
	}

	generateNewRequestTime(alfa: number, beta: number) {
		this.genTime = Number(Number(Math.random() * (beta - alfa)) + Number(alfa));
	}

	refuseRequest(){
		this.resusedRequestsAmount+=1;
	}
}

</script>