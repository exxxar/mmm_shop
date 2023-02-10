<template>

  <div class="py-5 text-center">
    <img class="d-block mx-auto mb-4" src="/images/logo.png"
         alt="" width="72" height="72">
    <h2>Форма загрузки товара</h2>
    <p class="lead">
      Для отправки данных в телеграм заполните все поля и загрузите нужное колличество изобаржений товара (до 5)
    </p>
  </div>

  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-12 col-md-8">
        <send-product-form-component/>
      </div>
    </div>
  </div>

</template>
