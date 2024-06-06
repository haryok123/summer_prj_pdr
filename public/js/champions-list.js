$(document).ready(function () {
  fetch('/statistics/top-users')
    .then((response) => response.json())
    .then((data) => {
      const tableBody = $('#championsTable tbody');
      tableBody.empty();
      data.forEach((user, index) => {
        tableBody.append(`
                <tr>
                  <td></td>
                  <td><img src="/images/avatar${user.user.user_photo}.gif" alt="${user.user.user_login} Avatar"
                     style="width:40px;" class="rounded-pill"> ${user.user.user_login} </td>
                  <td>${user.overallProgress}%</td>
                  <td>${user.examsPassed}</td>
                  <td>${user.correctAnswers}</td>
                </tr>
              `);
      });

      $('#championsTable').DataTable({
        searching: false,
        paging: false,
        info: false,
        columnDefs: [
          { orderable: false, targets: [0, 1] },
          { type: 'num', targets: [3, 4] },
        ],
        order: [],
        fnDrawCallback: function () {
          var api = this.api();
          var rows = api.rows({ page: 'current' }).nodes();
          api
            .column(0, { page: 'current' })
            .data()
            .each(function (data, i) {
              $('td:eq(0)', rows[i]).html(i + 1);
            });
        },
      });

      $('#loading').hide(); // Hide the loading animation
    });
});
