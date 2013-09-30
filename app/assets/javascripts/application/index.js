$(function(){
  var dave_the_oven = new Oven("Dave", 3)

  load_page(dave_the_oven)

  $('#new_batch').on('submit', function(event){
    event.preventDefault()
    prep_batch(dave_the_oven)
    $(this).find("input[type=text], input[type=number]").val("");
  })

  $('#bake').click(function(){
    dave_the_oven.bake()
  })

  $('td').click(function(){
    var rack_id = ("#" + this.id)
    $.each(dave_the_oven.racks, function(i, rack){
      if(rack.getter === rack_id){
        to_displaycase(rack.batch)
        rack.set_batch(null)
      }
      update_screen(dave_the_oven.racks)
    })
  })
})

function load_page(oven){
  $.get('/batches/prep_table', function(prep_table){
    $.each(prep_table, function(i, batch){
       prep_batch(oven, batch)
    })
  })

  var complete = [false, false, false]

  for(var j = 0; j < 3; j++){
    $.get('/batches/rack/' + j, function(data){
      var batch = data.batch
      if(batch){
        batch = new Batch(batch.cookie_type,
                          batch.bake_time,
                          batch.time_baked,
                          batch.cookie_status,
                          batch.id)
        oven.racks[data.j].set_batch(batch)
      }
      complete[data.j] = true
      if(complete[0] && complete[1] && complete[2]){
        update_screen(oven.racks)
      }
    })
  }

  $.get('/batches/displaycase', function(displaycase){
    $.each(displaycase, function(i, batch){
      batch = new Batch(batch.cookie_type,
                        batch.bake_time,
                        batch.time_baked,
                        batch.cookie_status,
                        batch.id)
      to_displaycase(batch)
    })
  })
}

function prep_batch(oven, batch_info) {
  var batch = null
  if (batch_info) {
    batch = new Batch(batch_info.cookie_type,
                      batch_info.bake_time,
                      batch_info.time_baked,
                      batch_info.cookie_status,
                      batch_info.id)
  } else {
    batch = new Batch($('input[name=batch_type]').val(), 
                      $('input[name=bake_time]').val())
    $.post('/batches', batch, function(batch_id){
      batch.batch_id = batch_id
    })
  }

  var li = $('<li>' + batch.cookie_type + '</li>')

  var button = $('<button id="#to_oven">Add To Oven</button>')
    .click(function(){
      alert(oven.insert_batch(batch))
      $(this).parent('li').remove()
    })

  li.append(button)

  $('#prep_batches').append(li)
}

function to_displaycase(batch){
  var li = $('<li class=' + batch.cookie_status + '>' + batch.cookie_type + '</li>')
  
  $.post('/batches/' + batch.batch_id, {_method: 'PUT', location: 'displaycase'})

  var button = $('<button>Eat!</button>')
    .click(function(){
      $.post('/batches/' + batch.batch_id, {_method: 'PUT', location: 'stomach'})
      $(this).parent('li').remove();
    })

  li.append(button)

  $('#displaycase').append(li)
}

function Rack(num){
  this.getter = '#rack_' + num
  this.batch = null;
}

Rack.prototype.set_batch = function(batch){
  this.batch = batch
}

function Oven(name, num_racks){
  this.name = name
  this.racks = []
  for(var i = 0; i < num_racks; i++){
    this.racks.push(new Rack(i))
  }
}

Oven.prototype.insert_batch = function(batch){
  var batch_added = false
  var message = 'Oven Full'
  $.each(this.racks, function(i, rack){
    if(!rack.batch && !batch_added){
      rack.set_batch(batch)
      $.post('/batches/' + batch.batch_id, {_method: 'PUT', location: rack.getter}, function(batch){
        console.log(batch)
      }, 'json')
      
      batch_added = true
      message = 'Cookies in the oven!'
    }
  })
  update_screen(this.racks)
  return message
}

Oven.prototype.bake = function(){
  $.each(this.racks, function(i, rack){
    if(rack.batch){
      rack.batch.change_status()
      $.post('/batches/' + rack.batch.batch_id, {_method: 'PUT', cookie_status: rack.batch.cookie_status})
    }
  })
  update_screen(this.racks)
}

function Batch(type, bake_time, time_baked, cookie_status, batch_id){
  this.cookie_type = type
  this.bake_time = bake_time
  if (time_baked) {
    this.time_baked = time_baked
  } else {
    this.time_baked = 0
  }
  if (cookie_status) {
    this.cookie_status = cookie_status
  } else {
    this.cookie_status = 'raw'
  }
  if (batch_id) {
    this.batch_id = batch_id
  }
}

Batch.prototype.change_status = function(){
  this.time_baked += 1
  if (this.time_baked < this.bake_time) {
    this.cookie_status = 'still_gooey'
  } else if (this.time_baked == this.bake_time) {
    this.cookie_status = 'just_right'
  } else {
    this.cookie_status = 'crispy'
  }
}

function update_screen(racks){
  $.each(racks, function(i, rack){
    if (!rack.batch){
      $(rack.getter)
        .html('[empty]')
        .removeClass()
    } else {
      $(rack.getter)
        .html(rack.batch.cookie_type + " [" + rack.batch.cookie_status + "]")
        .addClass(rack.batch.cookie_status)
    }
  })
}
