// Change theme function
   const currentTheme = localStorage.getItem('theme');
   if (currentTheme) {
      $('html')[0].setAttribute('data-theme', currentTheme);
      if (currentTheme === 'dark') {
         $('#change-theme-btn').prop('checked', true);
         $('#theme-text').html('Giao diện: Tối');
         $('#theme-icon').html('<i class="fa-solid fa-moon"></i>');
      }
   }
   $('#change-theme-btn').change(function(e) {
      if (e.target.checked) {
         $('html')[0].setAttribute('data-theme', 'dark');
         $('#theme-text').html('Giao diện: Tối');
         $('#theme-icon').html('<i class="fa-solid fa-moon"></i>');
         localStorage.setItem('theme', 'dark');
         if($('.table').hasClass('table-light')){
            $('.table').toggleClass('table-dark table-light');
         }
      } else {
         $('html')[0].setAttribute('data-theme', 'light');
         $('#theme-text').html('Giao diện: Sáng');
         $('#theme-icon').html('<i class="fa-solid fa-sun"></i>');
         localStorage.setItem('theme', 'light');
         if($('.table').hasClass('table-dark')){
            $('.table').toggleClass('table-dark table-light');
         }
      }
      
   });

   $('#theme-info').click(function() {
      if ($('#theme-text').html() === 'Giao diện: Sáng') {
         $('html')[0].setAttribute('data-theme', 'dark');
         $('#theme-text').html('Giao diện: Tối');
         $('#theme-icon').html('<i class="fa-solid fa-moon"></i>');
         localStorage.setItem('theme', 'dark');
      } else {
         $('html')[0].setAttribute('data-theme', 'light');
         $('#theme-text').html('Giao diện: Sáng');
         $('#theme-icon').html('<i class="fa-solid fa-sun"></i>');
         localStorage.setItem('theme', 'light');
      }
   });
// 

