<template>
  <form v-on:submit.prevent="submitForm">
    <div class="mb-3">
      <label for="productName" class="form-label">Наименование продукта</label>
      <input type="text" class="form-control"
             id="productName"
             v-model="form.name"
             placeholder="Название" required>
    </div>

    <div class="mb-3">
      <label for="productName" class="form-label">Цена товара</label>
      <input type="number" step="0.01" class="form-control"
             id="productName"
             v-model="form.price"
             placeholder="Цена товара" required>
    </div>

    <div class="mb-3">
      <label for="productName" class="form-label">Колличество товара</label>
      <input type="number" class="form-control"
             id="productName"
             v-model="form.count"
             placeholder="Число товара" required>
    </div>

    <div class="mb-3">
      <label for="productDescription" class="form-label">Описание товара</label>
      <textarea class="form-control"
                v-model="form.description"
                required
                rows="3"></textarea>
    </div>

    <div class="col-12 col-lg-12 mb-3">
      <span class="dt-label-input thin position-relative mb-2 col-auto px-0">добавьте фото
          <i class="fa-regular fa-circle-question dt-text-muted--white-50"></i>
      </span>

      <div class="col-auto mt-1 d-flex">
        <div class="photo-preview d-flex justify-content-start flex-wrap w-100">
          <label for="photos" style="margin-right: 10px;" class="photo-loader ml-2">
            <i class="fa-solid fa-plus lime"></i>
            <input type="file" id="photos" multiple accept="image/*" @change="onChangePhotos"
                   style="display:none;"/>

          </label>
          <div class="mb-2 img-preview" style="margin-right: 10px;" v-for="img in items"
               v-if="items.length>0">
            <img v-lazy="img.imageUrl">
          </div>

        </div>

      </div>
    </div>

    <div class="mb-3">
      <button type="submit" class="btn btn-outline-success w-100 p-3">Отправить</button>
    </div>
  </form>

</template>
<script>

export default {
  data() {
    return {

      form: {
        name: null,
        price: null,
        description: null,
        count: null,
      },
      photos: [],
      items: []
    }
  },

  mounted() {

  },
  methods: {

    onChangePhotos(e) {
      const files = e.target.files
      this.photos = files
      for (let i = 0; i < files.length; i++)
        this.items.push({imageUrl: URL.createObjectURL(files[i])})
    },

    submitForm() {
      let data = new FormData();
      Object.keys(this.form)
        .forEach(key => {
          const item = this.form[key] || ''
          if (typeof item === 'object')
            data.append(key, JSON.stringify(item))
          else
            data.append(key, item)
        });

      for (let i = 0; i < this.photos.length; i++)
        data.append('images[]', this.photos[i]);

      axios.post('/upload-form', data).then((response) => {
        window.location.reload()
      }).catch(err => {

      })

    },


  }
}
</script>
<style lang="scss">

.img-preview,
.photo-loader {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 42px;
  background: white;
  border-radius: 10px;
  border: 1px lightgray solid;

  img {
    width: 100%;
    height: 100%;
  }
}

.lime {
  color: lime;
}
</style>
