var DebugDraw = Box2D.Dynamics.b2DebugDraw;
var ctx;

function render() {
  var debugDraw = new DebugDraw();
  ctx = document.getElementById("canvas").getContext("2d");
  debugDraw.SetSprite(ctx);
  debugDraw.SetLineThickness(1.0);
  debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
  world.SetDebugDraw(debugDraw);

  window.setInterval(function() {
    step();

    ctx.clearRect(0, 0, 854, 400);
    ctx.save();
    ctx.transform(10, 0, 0, -10, 854 / 2, 400);
    world.DrawDebugData();
    ctx.restore();
  }, 1000 / 60);
}

init();
render();

