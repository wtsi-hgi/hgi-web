// Minimal Authentication Flow Demonstration

// MIT License
// Copyright (c) 2015 Genome Research Limited

$(document).ready(function() {
  var basic;

  // Get token 
  var getToken = function(callback) {
    $.ajax({
      url:      '/token',
      dataType: 'json',
      success:  function(data) {
        basic = data.basic;
        $('#auth').text('Basic ' + basic);
        callback(basic);
      }
    });
  };

  // Get API
  var getData = function(basic) {
    $.ajax({
      url:        '/api',
      dataType:   'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + basic);
      },

      error: function(xhr, status, error) {
        $('#api').text('Error: ' + error);
      },

      success: function(data) {
        $('#api').text(JSON.stringify(data, null, 2));
      }
    });
  };

  $('#fetch').click(function(e) {
    e.preventDefault();

    if (basic) {
      getData(basic);
    } else {
      getToken(getData);
    }
  });
});
