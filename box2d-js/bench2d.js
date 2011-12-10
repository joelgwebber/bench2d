var world;
var PYRAMID_SIZE = 40;

function setAsBox(sd, hx, hy) {
  sd.vertexCount = 4;
  sd.vertices[0].Set(-hx, -hy);
  sd.vertices[1].Set(hx, -hy);
  sd.vertices[2].Set(hx, hy);
  sd.vertices[3].Set(-hx, hy);
}

function init() {
  var gravity = new b2Vec2(0, -10);
  var worldAABB = new b2AABB();
  worldAABB.minVertex.Set(-1000, -1000);
  worldAABB.maxVertex.Set(1000, 1000);
  world = new b2World(worldAABB, gravity, true);

  { // Floor
    var sd = new b2PolyDef();
    setAsBox(sd, 50.0, 10.0);

    var bd = new b2BodyDef();
    bd.AddShape(sd);
    bd.position = new b2Vec2(0.0, -10.0);
    world.CreateBody(bd);
  }

  {
    var a = .5;
    var shape = new b2PolyDef();
    shape.density = 1;
    shape.friction = 1;
    shape.restitution = 1;
    setAsBox(shape, a, a);

    var x = new b2Vec2(-7.0, 0.75);
    var y = new b2Vec2(0, 0);
    var deltaX = new b2Vec2(0.5625, 1);
    var deltaY = new b2Vec2(1.125, 0.0);

    for (var i = 0; i < PYRAMID_SIZE; ++i){
      y.Set(x.x, x.y);

      for (var j = i; j < PYRAMID_SIZE; ++j) {
        var bd = new b2BodyDef();
        bd.AddShape(shape);
        bd.position = new b2Vec2(y.x, y.y);
        bd.rotation = 0;
        var body = world.CreateBody(bd);
        y.Add(deltaY);
      }

      x.Add(deltaX);
    }
  }
}

function step() {
  world.Step(1.0/60, 3);
}

init();

