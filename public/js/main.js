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
               <div class="p-3"><img class="card-img-top rounded-3" src="${row.img}" alt="..." /></div>
               <div class="card-body p-4">
                  <div class="text-center">
                     <h5 class="fw-bolder open-detail" data-id="${row.id}" role="button">${row.name}</h5>
                     <div class="d-flex justify-content-center small text-warning mb-2">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                     </div>
                     <span class="text-muted text-decoration-line-through">${(Math.round(row.price * (Math.random() + 1))).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                     <span class="fw-bold"> ${(row.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </div>
               </div>
               <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div class="text-center"><button class="btn btn-outline-dark mt-auto add-to-cart" data-id="${row.id}">Add to cart</button></div>
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
      srProds(id, name);
   })
   $('.open-detail').click(function () {
      let id = $(this).data('id');
      detailProd(id);
   })
   $('.add-to-cart').click(function () {
      if (!document.cookie.split('=')[1]) {
         alert('Please login to add to cart');
      } else {
         let id = $(this).data('id');
         addToCart(document.cookie.split('=')[1], id);
      }
   })
}
mainProds();

var allProds = async () => {
   let res_prods = await fb.getAll('products');
   let prods = await res_prods.json();
   $('#main-prods').html(repeateProds(prods));
   $('#main-noti').html(`
         <h2 class="text-center mb-5">All Products</h2>
      `);
   $('.open-detail').click(function () {
      let id = $(this).data('id');
      detailProd(id);
   })
   $('.add-to-cart').click(function () {
      if (!document.cookie.split('=')[1]) {
         alert('Please login to add to cart');
      } else {
         let id = $(this).data('id');
         addToCart(document.cookie.split('=')[1], id);
      }
   })
}
$('#main-all-prods').click(() => {
   allProds();
   location.hash = '#main-sect';
})
var srProds = async (id, name) => {
   $('header').hide();
   if (id != 0) {
      let res_prods = await fb.getWithOpt('products', `?orderBy="series"&equalTo=${id}`);
      let prods = await res_prods.json();
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
   $('.add-to-cart').click(function () {
      if (!document.cookie.split('=')[1]) {
         alert('Please login to add to cart');
      } else {
         let id = $(this).data('id');
         addToCart(document.cookie.split('=')[1], id);
      }
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
      $('.product').html(`
         <div class="product__photo">
            <div class="photo-container">
               <img src="${row.img}" alt="${row.name}" />
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
            <button class="buy--btn add-to-cart" data-id="${row.id}">ADD TO CART</button>
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
   $('.open-detail').click(function () {
      let id = $(this).data('id');
      detailProd(id);
   })
   $('.add-to-cart').click(function () {
      if (!document.cookie.split('=')[1]) {
         alert('Please login to add to cart');
      } else {
         let id = $(this).data('id');
         addToCart(document.cookie.split('=')[1], id);
      }
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
var getOneOfProd = async (id) => {
   let res_prod = await fb.getWithOpt('products', `?orderBy="id"&equalTo=${id}`);
   let prod = await res_prod.json();

   return prod;
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
var addToCart = async (uid, id) => {
   let res_cart = await fb.getWithOpt('carts', `?orderBy="uid"&equalTo="${uid}"`);
   let cart = await res_cart.json();
   let obj_id = Object.keys(cart)[0];

   if (!jQuery.isEmptyObject(cart)) {
      Object.keys(cart).forEach((key) => {
         const row = cart[key];
         let prods = row.products;

         if (prods.length == 0) {
            prods.push({ "id": id, "quantity": 1 });
         } else {
            let check = false;
            prods.forEach((prod) => {
               if (prod.id == id) {
                  check = true;
                  prod.quantity++;
               }
            })
            if (!check) {
               prods.push({ "id": id, "quantity": 1 });
            }
         }
         fb.edit('carts', obj_id, { "products": prods, "uid": uid });
      })
   } else {
      fb.add('carts', { "uid": uid, "products": [{ "id": id, "quantity": 1 }] });
   }
   alert('Add to cart success');
}
$('#cart-shortcut').click(async () => {
   location.hash = '#cart';
   $('header').hide();
   $('.main-sect').load('public/pages/cart.html');

   let res_prods = await fb.getAll('products');
   let list_prods = await res_prods.json();
   let res_cart = await fb.getWithOpt('carts', `?orderBy="uid"&equalTo="${document.cookie.split('=')[1]}"`);
   let cart_data = await res_cart.json();
   Object.keys(cart_data).forEach((key) => {
      const row = cart_data[key];
      let prods = row.products;
      let total = 0;
      let total_quantity = 0;
      $('#cart-table-body').html('');
      prods.forEach((prod) => {
         Object.keys(list_prods).forEach((key) => {
            const row = list_prods[key];
            if (row.id == prod.id) {
               total += row.price * prod.quantity;
               total_quantity += prod.quantity;
               $('#cart-table-body').append(`
                  <tr>
                     <td>
                        <div class="cart-img">
                           <img style="max-width: 200px; border-radius: 10px" src="${row.img}" />
                        </div>
                     </td>
                     <td>
                        <div class="cart-name">
                           <p>${row.name}</p>
                        </div>
                     </td>
                     <td>
                        <div class="cart-price">
                           <span class="price__value">${(row.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                     </td>
                     <td>
                        <div class="cart-quantity">
                           <span class="quantity__value">${prod.quantity}</span>
                        </div>
                     </td>
                     <td>
                        <div class="cart-total">
                           <span class="total__value">${(row.price*prod.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                     </td>
                     <td>
                        <div class="cart-remove">
                           <button class="btn btn-danger" data-id="${prod.id}">Remove</button>
                        </div>
                     </td>
                  </tr>
               `)
            }
         })
      })
      $('#cart-table-body').append(`
         <tr>
            <th colspan="3" class="text-center">Total</th>
            <th>${total_quantity}</th>
            <th>${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</th>
            <th></th>
         </tr>
      `)
      $('.cart-remove button').click(async (e) => {
         let id = e.target.dataset.id;
         let res_cart = await fb.getWithOpt('carts', `?orderBy="uid"&equalTo="${document.cookie.split('=')[1]}"`);
         let cart_data = await res_cart.json();
         let obj_id = Object.keys(cart_data)[0];
         let prods = cart_data[obj_id].products;
         let new_prods = [];
         prods.forEach((prod) => {
            if (prod.id != id) {
               new_prods.push(prod);
            }
         })
         if(new_prods.length == 0){
            fb.delete('carts', obj_id);
         }else{
            fb.edit('carts', obj_id, { "products": new_prods, "uid": document.cookie.split('=')[1] });
         }
         $(e.target).parent().parent().parent().remove();
         alert('Remove success');
      })
   })
})