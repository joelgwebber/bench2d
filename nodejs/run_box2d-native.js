'use strict';
//import Box2D from 'box2d-native';
var Box2D = require('box2d-native');
var world;

var PYRAMID_SIZE = 40;

export function init() {
  var gravity = new Box2D.b2Vec2(0.0, -10.0);
  world = new Box2D.b2World(gravity);

  {
    var bd_ground = new Box2D.b2BodyDef();
    var ground = world.CreateBody(bd_ground);

    var shape = new Box2D.b2EdgeShape();
    shape.Set(new Box2D.b2Vec2(-40.0, 0.0), new Box2D.b2Vec2(40.0, 0.0));
    ground.CreateFixture(shape, 0.0);
  }

  {
    var a = 0.5;
    var shape = new Box2D.b2PolygonShape();
    shape.SetAsBox(a, a);

    var x = new Box2D.b2Vec2(-7.0, 0.75);
    var y = new Box2D.b2Vec2(0, 0);
    var deltaX = new Box2D.b2Vec2(0.5625, 1);
    var deltaY = new Box2D.b2Vec2(1.125, 0.0);

    for (var i = 0; i < PYRAMID_SIZE; ++i) {
      y.Set(x.x, x.y);

      for (var j = i; j < PYRAMID_SIZE; ++j) {
        var bd = new Box2D.b2BodyDef();
        bd.type = Box2D.b2_dynamicBody;
        bd.position = new Box2D.b2Vec2(y.x, y.y);
        var body = world.CreateBody(bd);
        body.CreateFixture(shape, 5.0);
        //topBody = body;
        y.add(deltaY);
      }

      x.add(deltaX);
    }
  }
}

export function step() {
  world.Step(1 / 60, 3, 3);
}

export default {step, init};