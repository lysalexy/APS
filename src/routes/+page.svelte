<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
	crossorigin="anonymous"
/>
<meta charset="utf-8" />


<script>
	import EnterParameters from "./EnterPatameters.svelte";
</script>


<EnterParameters/>
 
<body>

	<h3><strong>Выберите режим работы</strong></h3>
	<br />

	<div class="d-grid gap-5 d-md-flex">
		<div class="col-auto">
			<button id="use-btn-parameters" class="btn btn-primary me-md-5">Пошаговый режим</button>
		</div>
		<div class="col-auto">
			<button id="null-btn-parameters" class="btn btn-primary">Автоматический режим </button><br />
		</div>
	</div>
	<br />
</body>
