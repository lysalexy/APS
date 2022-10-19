<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<meta charset="utf-8">

<script>
	 import { Button } from 'sveltestrap';
</script>

<head>
 <style type ='text/css'>
 body{margin: 0}

 </style>
 </head>

<body>
	<h3> <strong>Введите параметры системы</strong></h3><br>
	<div class="mb-3 row">
		<label for="get_N" class="col-sm-1 col-form-label">
			<strong>N</strong></label>
			<div class="col-sm-4">
			<input type="text" class="form-control" placeholder="Введите число заявок" id="get_N"/>
			</div>
</div><br>

<div class="mb-3 row">
	<label for="get_alfa" class="col-sm-1 col-form-label">
		<strong>alfa</strong></label>
		<div class="col-sm-4">
		<input type="text" class="form-control" placeholder="Введите минимальное время генерации заявки" id="get_alfa"/>
		</div>
</div><br>

<div class="mb-3 row">
	<label for="get_beta" class="col-sm-1 col-form-label">
		<strong>beta</strong></label>
		<div class="col-sm-4">
		<input type="text" class="form-control" placeholder="Введите максимальное время генерации заявки" id="get_beta"/>
		</div>
</div><br>

<div class="mb-3 row">
	<label for="get_source_amount" class="col-sm-1 col-form-label">
		<strong>число источников</strong></label>
		<div class="col-sm-4">
		<input type="text" class="form-control" placeholder="Введите число источников" id="get_source_amount"/>
		</div>
</div><br>

<div class="mb-3 row">
	<label for="get_reciever_amount" class="col-sm-1 col-form-label">
		<strong>число приёмников</strong></label>
		<div class="col-sm-4">
		<input type="text" class="form-control" placeholder="Введите число приёмников" id="get_reciever_amount"/>
		</div>
</div><br>

<div class="mb-3 row">
	<label for="get_buffer_size" class="col-sm-1 col-form-label">
		<strong>размер буфера</strong></label>
		<div class="col-sm-4">
		<input type="text" class="form-control" placeholder="Введите размер буфера" id="get_buffer_size"/>
		</div>
</div><br>


<div class="d-grid gap-5 d-md-flex">
    <Button color=primary on:click>Установить параметры</Button>

    <Button color=primary on:click>Обнулить параметры</Button>
</div>
<br>
<br>
<br>

<h3> <strong>Выберите режим работы</strong></h3><br>

<div class="d-grid gap-5 d-md-flex">
        <Button color=primary on:click>Пошаговый режим</Button>

        <Button color=primary on:click>Автоматический режим</Button><br>
    </div>
    <br>



</body>
