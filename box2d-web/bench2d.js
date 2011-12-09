var Vec2 = Box2D.Common.Math.b2Vec2
  , BodyDef = Box2D.Dynamics.b2BodyDef
  , Body = Box2D.Dynamics.b2Body
  , FixtureDef = Box2D.Dynamics.b2FixtureDef
  , Fixture = Box2D.Dynamics.b2Fixture
  , World = Box2D.Dynamics.b2World
  , MassData = Box2D.Collision.Shapes.b2MassData
  , PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  , CircleShape = Box2D.Collision.Shapes.b2CircleShape
  ;

var world;

var PYRAMID_SIZE = 40;

function init() {
  var gravity = new Vec2(0, -10);
  world = new World(gravity, true);

  {
    var shape = new PolygonShape();
    shape.SetAsEdge(new Vec2(-40.0, 0), new Vec2(40.0, 0));

    var fd = new FixtureDef();
    fd.density = 0.0;
    fd.shape = shape;

    var bd = new BodyDef();
    var ground = world.CreateBody(bd);
    ground.CreateFixture(fd);
  }

  {
    var a = .5;
    var shape = new PolygonShape();
    shape.SetAsBox(a, a);

    var x = new Vec2(-7.0, 0.75);
    var y = new Vec2();
    var deltaX = new Vec2(0.5625, 1);
    var deltaY = new Vec2(1.125, 0.0);

    for (var i = 0; i < PYRAMID_SIZE; ++i) {
      y.Set(x.x, x.y);

      for (var j = i; j < PYRAMID_SIZE; ++j) {
        var fd = new FixtureDef();
        fd.density = 5.0;
        fd.shape = shape;

        var bd = new BodyDef();
        bd.type = Body.b2_dynamicBody;
        bd.position.Set(y.x, y.y);
        var body = world.CreateBody(bd);
        body.CreateFixture(fd);
        y.Add(deltaY);
      }

      x.Add(deltaX);
    }
  }
}

function step() {
  world.Step(1 / 60, 3, 3);
}

