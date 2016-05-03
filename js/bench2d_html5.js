var world;
var topBody;

var PYRAMID_SIZE = 40;

function init() {
  var gravity = new box2d.b2Vec2(0.0, -10.0);
  world = new box2d.b2World(gravity);

  {
    var bd_ground = new box2d.b2BodyDef();
    var ground = world.CreateBody(bd_ground);

    var shape = new box2d.b2EdgeShape();
    shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
    ground.CreateFixture(shape, 0.0);
  }

  {
    var a = 0.5;
    var shape = new box2d.b2PolygonShape();
    shape.SetAsBox(a, a);

    var x = new box2d.b2Vec2(-7.0, 0.75);
    var y = new box2d.b2Vec2(0, 0);
    var deltaX = new box2d.b2Vec2(0.5625, 1);
    var deltaY = new box2d.b2Vec2(1.125, 0.0);

    for (var i = 0; i < PYRAMID_SIZE; ++i) {
      y.Set(x.x, x.y);

      for (var j = i; j < PYRAMID_SIZE; ++j) {
        var bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        bd.position.Set(y.x, y.y);
        var body = world.CreateBody(bd);
        body.CreateFixture(shape, 5.0);
        topBody = body;
        y.SelfAdd(deltaY);
      }

      x.SelfAdd(deltaX);
    }
  }
}

function step() {
  world.Step(1 / 60, 3, 3);
}

