import { FireBaseService } from "./firebaseService.js";

const fb = new FireBaseService();
const repeateProds = (prods) => {
   let out = '';
   Object.keys(prods).forEach((key) => {
      const row = prods[key];
      out += `
         <div class="col mb-5">
            <div class="card h-100">
               <div class="badge bg-danger text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
               <div class="p-3"><img class="card-img-top rounded-3" src="public/${row.img}" alt="..." /></div>
               <div class="card-body p-4">
                  <div class="text-center">
                     <h5 class="fw-bolder open-detail" data-id="${row.id}" role="button">${row.name}</h5>
                     <div class="d-flex justify-content-center small text-warning mb-2">
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                     </div>
                     <span class="text-muted text-decoration-line-through">${(Math.round(row.price * (Math.random() + 1))).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                     ${(row.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
               </div>
               <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
               </div>
            </div>
         </div>
      `
   })
   return out;
}
var mainProds = async () => {
   let res_prods = await fb.getWithOpt('products', `?orderBy="id"&limitToFirst=8`);
   let prods = await res_prods.json();
   $('#main-prods').html(repeateProds(prods));

   //  Dropdown
   let res_series = await fb.getAll('series');
   let srs = await res_series.json();
   Object.keys(srs).forEach((key) => {
      const row = srs[key];
      $('#prods-dropdown').append(`
         <a class="dropdown-item" data-id="${row.id}" href="#${(row.name).toLowerCase().replace(/ /g, "-")}">${row.name}</a>
      `)
   })

   $('#prods-dropdown .dropdown-item' || '.detail-prod-series').click(function () {
      let id = $(this).data('id');
      let name = $(this).html();
      $('.main-sect').attr('id', `${(name).toLowerCase().replace(/ /g, "-")}`)
      srProds(id, name);
   })
   $('.open-detail').click(function () {
      let id = $(this).data('id');
      detailProd(id);
   })
}
mainProds();

var allProds = async () => {
   let res_prods = await fb.getAll('products');
   let prods = await res_prods.json();
   $('#main-prods').html(repeateProds(prods));
   $('.open-detail').click(function () {
      let id = $(this).data('id');
      detailProd(id);
   })
}
$('#main-all-prods').click(() => {
   allProds();
   location.hash = '#main-sect';
})
var srProds = async (id, name) => {
   if (id != 0) {
      let res_prods = await fb.getWithOpt('products', `?orderBy="series"&equalTo=${id}`);
      let prods = await res_prods.json();
      console.log(prods);
      $('#main-prods').html('');

      if (jQuery.isEmptyObject(prods)) {
         $('#main-noti').html(`
         <h2 class="text-center">No products in this series</h2>
      `)
      } else {
         $('#main-noti').html(`
            <h2 class="text-center mb-5">${name}</h2>
         `);
         $('#main-prods').html(repeateProds(prods));
      }
   }
   $('.open-detail').click(function () {
      let id = $(this).data('id');
      detailProd(id);
   })
}

var detailProd = async (id) => {
   let res_prod = await fb.getWithOpt('products', `?orderBy="id"&equalTo=${id}`);
   let prod = await res_prod.json();
   let res_series = await fb.getAll('series');
   let series = await res_series.json();
   let res_size = await fb.getAll('size');
   let size = await res_size.json();
   Object.keys(prod).forEach((key) => {
      const row = prod[key];
      console.log(series);
      $('.product').html(`
         <div class="product__photo">
            <div class="photo-container">
               <img src="public/${row.img}" alt="${row.name}" />
            </div>
         </div>
         <div class="product__info">
            <div class="title">
               <h1>${row.name}</h1>
            </div>
            <div class="price">
               <span class="price__value">${(row.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div class="description">
               <h4>Series: <span role="button" data-id="${row.series}" class="text-info detail-prod-series">${getDetail(series, row.series)}</span></h4>
               <h4>Size: <span class="text-info">${getDetail(size, row.size)}</span></h4>
            </div>
            <button class="buy--btn">ADD TO CART</button>
         </div>
      `)
   })
   $('#detailProdModal').modal('show');
   $('.detail-prod-series').click(function () {
      let id = $(this).data('id');
      let name = $(this).html();
      srProds(id, name);
      $('#detailProdModal').modal('hide');
   })
}
var getDetail = (arr, id) => {
   let out = '';
   Object.keys(arr).forEach((key) => {
      const rowA = arr[key];
      if (rowA.id == id) {
         out = (rowA.name);
      }
   })
   return out;
}
$('#search-prod').submit(async (e) => {
   e.preventDefault();
   location.hash = '#search?' + $('#searchProdName').val();
   let search = $('#searchProdName').val();
   let res_prods = await fb.getAll('products');
   let prods = await res_prods.json();
   let result = [];
   Object.keys(prods).forEach((key) => {
      const row = prods[key];
      let convName = row.name.replace(/ /g, "").toLowerCase();
      if (convName.search(search) != -1) {
         result.push(row);
      }
   })
   $('#main-prods').html('');
   if (result.length == 0) {
      $('#main-noti').html(`
         <h2 class="text-center">No products have name like '<span class="text-danger">${search}</span>'</h2>
      `)
   } else {
      $('#main-noti').html('');
      $('#main-prods').html(repeateProds(result));
   }
})