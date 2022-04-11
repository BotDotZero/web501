import { FireBaseService } from "./firebaseService.js";

const fb = new FireBaseService();

var adminProds = async () => {
   let res_prods = await fb.getAll('products');
   let prods = await res_prods.json();
   let res_series = await fb.getAll('series');
   let srs = await res_series.json();
   let res_size = await fb.getAll('size');
   let szs = await res_size.json();
   $('#tbl-prod').html('');
   Object.keys(prods).forEach((key) => {
      const row = prods[key];
      $('#tbl-prod').append(`
         <tr>
            <th>${row.id}</th>
            <td><img src="../public/${row.img}" style="max-width: 200px"></td>
            <td>${row.name}</td>
            <td>${Intl.NumberFormat('vi-VN').format(row.price)}</td>
            <td>${(row.release).split('-').reverse().join('/')}</td>
            <td>${row.series}</td>
            <td>${row.size}</td>
            <td>
               <button id="editProdBtn" class="btn btn-sm btn-outline-warning editProdBtn">Edit</button> |
               <button class="btn btn-sm btn-outline-danger delProdBtn">Del</button>
            </td>
         </tr>
      `)
   })
   // `<button onclick="loadEditProd(${row.id})" class="btn btn-sm btn-outline-warning">Edit</button> |
   // <button onclick="if(confirm('Xoá thật không?')) delProd(${row.id})" class="btn btn-sm btn-outline-danger">Del</button>`
   $('.slProdSeries').html('');
   Object.keys(srs).forEach((key) => {
      const row = srs[key];
      $('.slProdSeries').append(`
         <option value="${row.id}">${row.name}</option>
      `)
   })
   $('.slProdSize').html('');
   Object.keys(szs).forEach((key) => {
      const row = szs[key];
      $('.slProdSize').append(`
         <option value="${row.id}">${row.name} (${row.info})</option>
      `)
   })

   // Edit
   $('.editProdBtn').click(function () {
      let id = $(this).parent().parent().find('th:eq(0)').text();
      loadEditProd(id);
   });
   // Delete
   $('.delProdBtn').click(function () {
      let id = $(this).parent().parent().find('th:eq(0)').text();
      if (confirm('Xoá thật không?')) delProd(id);
   });

   $('#newProdForm').submit(function (e) {
      e.preventDefault();
      let newImg = $(this).find('#newPimg').val();
      let newName = $(this).find('#newPname').val();
      let newPrice = $(this).find('#newPprice').val();
      let newRelease = $(this).find('#newPrelease').val();
      let newSeries = $(this).find('#newPseries').val();
      let newSize = $(this).find('#newPsize').val();
      addProd(newImg, newName, newPrice, newRelease, newSeries, newSize);
      $("#newProdModal").modal('hide');
      $(this).trigger('reset');
   });   // Add product

   $('#editProdForm').submit(function (e) {
      e.preventDefault();
      let editId = $(this).find('#editPid').val();
      let editImg = $(this).find('#editPimg').val();
      let editName = $(this).find('#editPname').val();
      let editPrice = $(this).find('#editPprice').val();
      let editRelease = $(this).find('#editPrelease').val();
      let editSeries = $(this).find('#editPseries').val();
      let editSize = $(this).find('#editPsize').val();
      editProd(editId, editImg, editName, editPrice, editRelease, editSeries, editSize);
      $("#editProdModal").modal('hide');
      $(this).trigger('reset');
   });   // Edit Product
}  // adminProds();

var loadEditProd = async (id) => {
   let res_prod = await fb.getWithOpt('products', `?orderBy="id"&equalTo=${id}`);
   let edit_prod = await res_prod.json();
   Object.keys(edit_prod).forEach((key) => {
      const row = edit_prod[key];
      var editForm = document.querySelector('#editProdForm');
      editForm.editProdId.value = row.id;
      editForm.editProdImage.value = row.img;
      editForm.editProdName.value = row.name;
      editForm.editProdPrice.value = row.price;
      editForm.editProdRelease.value = row.release;
      editForm.editProdSeries.value = row.series;
      editForm.editProdSize.value = row.size;
   })
   $("#editProdModal").modal('show');
}  // Load data to edit form

var addProd = async (i, n, p, r, sr, sz) => {
   let res1 = await fb.getWithOpt('products', `?orderBy="id"&limitToLast=1`);
   let data = await res1.json();
   let last_id = data[Object.keys(data)[0]].id;
   let dataPost = JSON.stringify({
      id: parseInt(last_id) + 1,
      img: i,
      name: n,
      price: parseInt(p),
      release: r,
      series: parseInt(sr),
      size: parseInt(sz)
   })
   let res = await fb.add('products', dataPost)
      .then(res => {
         $('.sidebar__item[data-page="3"]').click();
         alert('Thêm thành công');
      })
}
var editProd = async (id, i, n, p, r, sr, sz) => {
   let res1 = await fb.getWithOpt('products', `?orderBy="id"&equalTo=${id}`);
   let data = await res1.json();
   let obj_id = Object.keys(data)[0];
   let dataPost = JSON.stringify({
      id: parseInt(id),
      img: i,
      name: n,
      price: parseInt(p),
      release: r,
      series: parseInt(sr),
      size: parseInt(sz)
   })
   let res = await fb.edit('products', obj_id, dataPost)
      .then(res => {
         $('.sidebar__item[data-page="3"]').click();
         alert('Sửa thành công');
      })
}
var delProd = async (id) => {
   let res1 = await fb.getWithOpt('products', `?orderBy="id"&equalTo=${id}`);
   let data = await res1.json();
   let obj_id = Object.keys(data)[0];
   let res = await fb.delete('products', obj_id)
      .then(res => {
         $('.sidebar__item[data-page="3"]').click();
         alert('Xoá thành công');
      });
}

var adminSeries = async () => {
   let res_series = await fb.getAll('series');
   let srs = await res_series.json();
   $('#tbl-series').html('');
   Object.keys(srs).forEach((key) => {
      const row = srs[key];
      $('#tbl-series').append(`
         <tr>
            <th>${row.id}</th>
            <td>${row.name}</td>
            <td>
               <button class="btn btn-sm btn-outline-warning editSrBtn">Edit</button> |
               <button class="btn btn-sm btn-outline-danger delSrBtn">Del</button>
            </td>
         </tr>
      `)
   })

   // Edit
   $('.editSrBtn').click(function () {
      let id = $(this).parent().parent().find('th:eq(0)').text();
      loadEditSr(id);
   });
   // Delete
   $('.delSrBtn').click(function () {
      let id = $(this).parent().parent().find('th:eq(0)').text();
      if (confirm('Xoá thật không?')) delSr(id);
   });
   $('#newSeriesForm').submit(function (e) {
      e.preventDefault();
      let newName = $(this).find('#newSrName').val();
      addSr(newName);
      $("#newSeriesModal").modal('hide');
      $(this).trigger('reset');
   }); // Add Series

   $('#editSeriesForm').submit(function (e) {
      e.preventDefault();
      let editId = $(this).find('#editSrId').val();
      let editName = $(this).find('#editSrName').val();
      editSr(editId, editName);
      $("#editSeriesModal").modal('hide');
      $(this).trigger('reset');
   }); // Edit Series
}  // adminSeries();

var loadEditSr = async (id) => {
   let res_sr = await fb.getWithOpt('series', `?orderBy="id"&equalTo=${id}`);
   let edit_sr = await res_sr.json();
   Object.keys(edit_sr).forEach((key) => {
      const row = edit_sr[key];
      var editForm = document.querySelector('#editSeriesForm');
      editForm.editSrId.value = row.id;
      editForm.editSrName.value = row.name;
   })
   $("#editSeriesModal").modal('show');
}  // Load data to edit form

var addSr = async (n) => {
   let res1 = await fb.getWithOpt('series', `?orderBy="id"&limitToLast=1`);
   let data = await res1.json();
   let last_id = data[Object.keys(data)[0]].id;
   let dataPost = JSON.stringify({
      id: parseInt(last_id) + 1,
      name: n
   })
   let res = await fb.add('series', dataPost)
      .then(res => {
         $('.sidebar__item[data-page="1"]').click();
         alert('Thêm thành công');
      })
}
var editSr = async (id, n) => {
   let res1 = await fb.getWithOpt('series', `?orderBy="id"&equalTo=${id}`);
   let data = await res1.json();
   let obj_id = Object.keys(data)[0];
   let dataPost = JSON.stringify({
      id: parseInt(id),
      name: n
   })
   let res = await fb.edit('series', obj_id, dataPost)
      .then(res => {
         $('.sidebar__item[data-page="1"]').click();
         alert('Sửa thành công');
      })
}
var delSr = async (id) => {
   let res1 = await fb.getWithOpt('series', `?orderBy="id"&equalTo=${id}`);
   let data = await res1.json();
   let obj_id = Object.keys(data)[0];
   let res = await fb.delete('series', obj_id)
      .then(res => {
         $('.sidebar__item[data-page="1"]').click();
         alert('Xoá thành công');
      });
}

var adminUsers = async () => {
   let res_users = await fb.getAll('users');
   let usr = await res_users.json();
   $('#tbl-users').html('');
   Object.keys(usr).forEach((key) => {
      const row = usr[key];
      $('#tbl-users').append(`
         <tr>
            <th>${row.id}</th>
            <td>${row.uid}</td>
            <td>${row.email}</td>
            <td>${row.name}</td>
            <td>${row.permission == 1 ? 'Admin' : 'User'}</td>
            <td>${row.status == 1 ? 'Active' : 'Banned'}</td>
            <td>
               ${row.status == 1 ? `<button class="btn btn-sm btn-outline-danger userBanBtn">Ban</button>` : `<button class="btn btn-sm btn-outline-success userUnbanBtn">Unban</button>`}
            </td>
         </tr>
      `)

      // Ban
      $('.userBanBtn').click(function () {
         let id = $(this).parent().parent().find('th:eq(0)').text();
         banUsr(id);
      });
      $('.userUnbanBtn').click(function () {
         let id = $(this).parent().parent().find('th:eq(0)').text();
         unbanUsr(id);
      });
   })
}  // adminUsers();


var banUsr = async (id) => {
   let res1 = await fb.getWithOpt('users', `?orderBy="id"&equalTo=${id}`);
   let data = await res1.json();
   let obj_id = Object.keys(data)[0];
   let dataPost = '';
   Object.keys(data).forEach((key) => {
      const row = data[key];
      dataPost = JSON.stringify({
         id: parseInt(id),
         uid: row.uid,
         email: row.email,
         name: row.name,
         permission: row.permission,
         status: 0
      })
   })
   let res = await fb.edit('users', obj_id, dataPost)
      .then(res => {
         adminUsers();
         alert('Ban thành công');
      })
}
var unbanUsr = async (id) => {
   let res1 = await fb.getWithOpt('users', `?orderBy="id"&equalTo=${id}`);
   let data = await res1.json();
   let obj_id = Object.keys(data)[0];
   let dataPost = '';
   Object.keys(data).forEach((key) => {
      const row = data[key];
      dataPost = JSON.stringify({
         id: parseInt(id),
         uid: row.uid,
         email: row.email,
         name: row.name,
         permission: row.permission,
         status: 1
      })
   })
   let res = await fb.edit('users', obj_id, dataPost)
      .then(res => {
         adminUsers();
         alert('Unban thành công');
      })
}

// Change admin page
const pages = [
   {
      id: 0,
      url: 'home.html',
   },
   {
      id: 1,
      url: 'view/admin_series.html',
      function: adminSeries
   },
   {
      id: 2,
      url: 'view/admin_size.html',
   },
   {
      id: 3,
      url: 'view/admin_products.html',
      function: adminProds
   },
   {
      id: 4,
      url: 'view/admin_users.html',
      function: adminUsers
   },
]
let loadpage = (idp) => {
   if (idp == 0 || idp == 2) {
      $('#admin-load-page').html('<h1>Nothing here</h1>')
   } else {
      $('#admin-load-page').load(pages.find(page => page.id === idp).url)
      pages.find(page => page.id === idp).function()
   }
}
$('.sidebar__item').click(function () {
   $('.sidebar__item.sidebar__item--active').removeClass('sidebar__item--active')
   loadpage($(this).data('page'));
   $(this).addClass('sidebar__item--active')
});

