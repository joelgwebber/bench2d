var canvas, ctx;

function drawWorld(world, context) {
  context.save();
  context.transform(8, 0, 0, -8, 854/2, 400);

  for (var b = world.m_bodyList; b; b = b.m_next) {
    for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
      drawShape(s, context);
    }
  }

  context.restore();
}

function drawShape(shape, context) {
  context.fillStyle = '#ffffff';
  context.beginPath();
  switch (shape.m_type) {
    case b2Shape.e_circleShape: {
      var circle = shape;
      var pos = circle.m_position;
      var r = circle.m_radius;
      var segments = 16.0;
      var theta = 0.0;
      var dtheta = 2.0 * Math.PI / segments;
      // draw circle
      context.moveTo(pos.x + r, pos.y);
      for (var i = 0; i < segments; i++) {
        var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
        var v = b2Math.AddVV(pos, d);
        context.lineTo(v.x, v.y);
        theta += dtheta;
      }
      context.lineTo(pos.x + r, pos.y);
      break;
    }
    case b2Shape.e_polyShape: {
      var poly = shape;
      var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
      context.moveTo(tV.x, tV.y);
      for (var i = 0; i < poly.m_vertexCount; i++) {
        var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
        context.lineTo(v.x, v.y);
      }
      context.lineTo(tV.x, tV.y);
      break;
    }
  }
  context.fill();
}

function render() {
  canvas = $('canvas');
  ctx = canvas.getContext('2d');
  setInterval(function() {
    step();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld(world, ctx);
  }, 10);
}

render();

