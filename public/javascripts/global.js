// userlist data array for filling box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

  // Username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  // button add user
  $('#btnAddUser').on('click', addUser);

  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // a jQuery AJAX to get data from  localhost:3000/users/userlist .JSON
  $.getJSON( '/users/userlist', function( data ) {
    
   // Stick our user data array into a userlist variable in the global object
    userListData = data;
    
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent); 
  });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();
  
    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');
  
    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
    console.log(arrayPosition);
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.username);
    $('#userInfoAge').text(thisUserObject.age); 
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

// Add a User
function addUser(event) {
    
  // Prevent Link from Firing
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
  
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
  
      // If it is, compile all user info into one object
      var newUser = {
        'username': $('#addUser fieldset input#inputUserName').val(),
        'email': $('#addUser fieldset input#inputUserEmail').val(),
        'fullname': $('#addUser fieldset input#inputUserFullname').val(),
        'age': $('#addUser fieldset input#inputUserAge').val(),
        'location': $('#addUser fieldset input#inputUserLocation').val(),
        'gender': $('#addUser fieldset input#inputUserGender').val()
      }
  
      // Use AJAX to post the object to our adduser service
      $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/adduser',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addUser fieldset input').val('');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert(' Add user Error! : ' + response.msg);
  
        }
      });
    }
    else {
      // If errorCount is more than 0, error out
      alert('Please fill in all fields');
      return false;
    }
};

// Delete a User
function deleteUser(event){

  // Prevent Link from Firing
  event.preventDefault();

  // Pop up confirm delete dialog
  var confirmDelete = confirm('Are you sure to delete this user?');

  // Check and make sure the  user confirmed
  if(confirmation === true) {

    // if ok, then do our delete
    $.ajax({
      type: 'DELETE',
      url: 'user/deleteuser' + $(this).attr('rel')
    }).done(function(response) {
        
      // Check for a successful (blank) response
      if(response.msg === ''){
        // deletion OK!
      } 
      else {
        alert('Delete user Error! : ' + respose.msg);
      }

      // Update the table
      populateTable();
    });
  
  }
  else {
    
    //if they said no to the Confirm, do nothing
    return false;
  
  }

};