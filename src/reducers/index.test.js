var { expect } = require('chai');
import index from './index'
import {roll} from './index'




describe('Reducer', function() {

  beforeEach(function() {

  });

  // it('init', function() {
  //
  //   var state = index({}, {type:'ROLL'});
  //   expect(state!=null).to.equal(true);
  // });

  it('roll', function() {

    var rstate = {
      frames: []
    };

    rstate = roll(rstate, 4);
    console.info(rstate);
    expect(rstate.frames.length).to.equal(1);
    expect(rstate.frames[0].first).to.equal(4);
    expect(rstate.score).to.equal(4);

    // spare
    rstate = roll(rstate, 6);
    expect(rstate.frames[0].spare).to.equal(true);
    expect(rstate.frames[0].second).to.equal(6);
    expect(rstate.score).to.equal(10);

    // strike
    rstate = roll(rstate, 10);
    expect(rstate.frames[1].strike).to.equal(true);
    expect(rstate.frames[1].first).to.equal(10);
    console.info(rstate);


  });

});