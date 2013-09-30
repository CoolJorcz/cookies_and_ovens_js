describe("true is true", function() {
  it("is true", function(){
    expect(true).toBe(true);
  })
})

describe("an oven", function(){
  // var oven
  // var batch

  // beforeEach(function(){
  //   oven = new Oven("Steve", 1)
  //   batch = jasmine.createSpy('batch')
  // })

  it("has racks", function(){
    
  })

  it("hold a batch of cookies", function(){
    var oven = new Oven("Stevie", 1)
    var batch = new Batch("Stuff", 1)
    oven.insert_batch(batch)
    expect(oven.racks.zero).toEqual(batch)
  })

  it("rejects cookies if it is already full", function(){

  })

  it("changes the status of cookies in it", function(){
    
  })
})

describe("a rack", function(){
  it("batch equals null on initialize", function(){
    var rack = new Rack(0)
    expect(rack.batch).toBe(null)
  })

  it("", function(){

  })
})

describe("a batch", function(){
  it()
})

