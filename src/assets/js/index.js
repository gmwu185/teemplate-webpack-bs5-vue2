console.log('bootstrap-Obj', bootstrap);
console.log('jQuery-Obj', jQuery, 'jQuery -> $', $);
console.log('index.js');

$.ajax({
  url: 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',
  method: 'GET',
  dataType: 'json',
  success: function (res) {
    console.log('$.ajax -> res -> data', res.result.records);
  },
  error: function (err) {
    console.log(err);
  },
});
