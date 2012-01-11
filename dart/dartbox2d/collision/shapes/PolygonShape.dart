// Copyright 2012 Google Inc. All Rights Reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Convex Polygon Shape. Create using Body.createShape(ShapeDef) rather than the
 * constructor here, which is off-limits to the likes of you.
 */
class PolygonShape extends Shape {
  /**
   * num of pooled vectors to use internally.
   */
  static final int POOL_VECTORS = 6;

  /**
   * Local position of the shape centroid in parent body frame.
   */
  final Vector centroid;

  /**
   * The vertices of the shape. Note: Use getVertexCount() rather than
   * vertices.length to get the number of active vertices.
   */
  final List<Vector> vertices;

  /**
   * The normals of the shape. Note: Use getVertexCount() rather than
   * normals.length to get the number of active normals.
   */
  final List<Vector> normals;

  int vertexCount;

  // A bunch of Vectors in a pool to be used internally as needed.
  final List<Vector> vectorPool;

  // A pooled transform to be used internally.
  Transform poolTransform;

  /**
   * Constructs a new PolygonShape.
   */
  PolygonShape() :
    super(ShapeType.POLYGON, Settings.POLYGON_RADIUS),
    vertexCount = 0,
    vertices = new List<Vector>(Settings.MAX_POLYGON_VERTICES),
    normals = new List<Vector>(Settings.MAX_POLYGON_VERTICES),
    centroid = new Vector(),
    poolTransform = new Transform(),
    vectorPool = new List<Vector>(6) {

    for (int i = 0; i < POOL_VECTORS; i++) {
      vectorPool[i] = new Vector();
    }
    for (int i = 0; i < vertices.length; i++) {
      vertices[i] = new Vector();
    }
    for (int i = 0; i < normals.length; i++) {
      normals[i] = new Vector();
    }
  }

  /**
   * Constructs a new PolygonShape equal to the given shape.
   */
  PolygonShape.copy(PolygonShape other) :
    super(ShapeType.POLYGON, other.radius),
    vertexCount = other.vertexCount,

    vertices = new List<Vector>(Settings.MAX_POLYGON_VERTICES),
    normals = new List<Vector>(Settings.MAX_POLYGON_VERTICES),
    centroid = new Vector.copy(other.centroid),
    vectorPool = new List<Vector>(6),
    poolTransform = new Transform() {
    for (int i = 0; i < POOL_VECTORS; i++) {
      vectorPool[i] = new Vector();
    }

    // Copy the vertices and normals from the other polygon shape.
    for (int i = 0; i < other.vertices.length; i++) {
      vertices[i] = new Vector.copy(other.vertices[i]);
    }
    for (int i = 0; i < other.normals.length; i++) {
      normals[i] = new Vector.copy(other.normals[i]);
    }
  }

  /**
   * Get the supporting vertex index in the given direction.
   */
  int getSupport(Vector d) {
    int bestIndex = 0;
    num bestValue = Vector.dot(vertices[0], d);
    for (int i = 1; i < vertexCount; i++) {
      num value = Vector.dot(vertices[i], d);
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return bestIndex;
  }

  Shape clone() {
    return new PolygonShape.copy(this);
  }

  /**
   * Get the supporting vertex in the given direction.
   */
  Vector getSupportVertex(Vector d) {
    int bestIndex = 0;
    num bestValue = Vector.dot(vertices[0], d);
    for (int i = 1; i < vertexCount; i++) {
      num value = Vector.dot(vertices[i], d);
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return vertices[bestIndex];
  }

  /**
   * Copy vertices. This assumes the vertices define a convex polygon.
   * It is assumed that the exterior is the the right of each edge.
   */
  void setFrom(List<Vector> otherVertices, int count) {
    assert (2 <= count && count <= Settings.MAX_POLYGON_VERTICES);
    vertexCount = count;

    // Copy vertices.
    for (int i = 0; i < vertexCount; i++) {
      if (vertices[i] == null){
        vertices[i] = new Vector();
      }
      vertices[i].setFrom(otherVertices[i]);
    }

    Vector edge = vectorPool[0];

    // Compute normals. Ensure the edges have non-zero length.
    for (int i = 0; i < vertexCount; ++i) {
      final int i1 = i;
      final int i2 = i + 1 < vertexCount ? i + 1 : 0;
      edge.setFrom(vertices[i2]).subLocal(vertices[i1]);

      assert (edge.lengthSquared > Settings.EPSILON * Settings.EPSILON);
      Vector.crossVectorAndNumToOut(edge, 1, normals[i]);
      normals[i].normalize();
    }

    // Compute the polygon centroid.
    computeCentroidToOut(vertices, vertexCount, centroid);
  }

  /**
   * Build vertices to represent an axis-aligned box.
   * hx is the half-width of the body and hy is the half height.
   */
  void setAsBox(num hx, num hy) {
    vertexCount = 4;
    vertices[0].setCoords(-hx, -hy);
    vertices[1].setCoords(hx, -hy);
    vertices[2].setCoords(hx, hy);
    vertices[3].setCoords(-hx, hy);
    normals[0].setCoords(0.0, -1.0);
    normals[1].setCoords(1.0, 0.0);
    normals[2].setCoords(0.0, 1.0);
    normals[3].setCoords(-1.0, 0.0);
    centroid.setZero();
  }

  /**
   * Build vertices to represent an oriented box. hx is the halfwidth, hy the
   * half-height, center is the center of the box in local coordinates and angle
   * is the rotation of the box in local coordinates.
   */
  void setAsBoxWithCenterAndAngle(num hx, num hy, Vector center,
      num angle) {
    vertexCount = 4;
    vertices[0].setCoords(-hx, -hy);
    vertices[1].setCoords(hx, -hy);
    vertices[2].setCoords(hx, hy);
    vertices[3].setCoords(-hx, hy);
    normals[0].setCoords(0.0, -1.0);
    normals[1].setCoords(1.0, 0.0);
    normals[2].setCoords(0.0, 1.0);
    normals[3].setCoords(-1.0, 0.0);
    centroid.setFrom(center);

    Transform xf = poolTransform;
    xf.position.setFrom(center);
    xf.rotation.setAngle(angle);

    // Transform vertices and normals.
    for (int i = 0; i < vertexCount; ++i) {
      Transform.mulToOut(xf, vertices[i], vertices[i]);
      Matrix22.mulMatrixAndVectorToOut(xf.rotation, normals[i], normals[i]);
    }
  }

  /**
   * Set this as a single edge.
   */
  void setAsEdge(Vector v1, Vector v2) {
    vertexCount = 2;
    vertices[0].setFrom(v1);
    vertices[1].setFrom(v2);
    centroid.setFrom(v1).addLocal(v2).mulLocal(0.5);
    normals[0].setFrom(v2).subLocal(v1);
    Vector.crossVectorAndNumToOut(normals[0], 1, normals[0]);
    normals[0].normalize();
    normals[1].setFrom(normals[0]).negateLocal();
  }

  /**
   * See Shape.testPoint(Transform, Vector).
   */
  bool testPoint(Transform xf, Vector p) {
    Vector pLocal = vectorPool[0];

    pLocal.setFrom(p).subLocal(xf.position);
    Matrix22.mulTransMatrixAndVectorToOut(xf.rotation, pLocal, pLocal);

    Vector temp = vectorPool[1];

    for (int i = 0; i < vertexCount; ++i) {
      temp.setFrom(pLocal).subLocal(vertices[i]);
      num dot = Vector.dot(normals[i], temp);
      if (dot > 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * See Shape.computeAxisAlignedBox(AABB, Transform).
   */
  void computeAxisAlignedBox(AxisAlignedBox argAabb, Transform argXf) {
    final Vector lower = vectorPool[0];
    final Vector upper = vectorPool[1];
    final Vector v = vectorPool[2];

    Transform.mulToOut(argXf, vertices[0], lower);
    upper.setFrom(lower);

    for (int i = 1; i < vertexCount; ++i) {
      Transform.mulToOut(argXf, vertices[i], v);
      Vector.minToOut(lower, v, lower);
      Vector.maxToOut(upper, v, upper);
    }

    argAabb.lowerBound.x = lower.x - radius;
    argAabb.lowerBound.y = lower.y - radius;
    argAabb.upperBound.x = upper.x + radius;
    argAabb.upperBound.y = upper.y + radius;
  }

  /**
   * Get a vertex by index.
   */
  Vector getVertex(int index) {
    return vertices[index];
  }

  /**
   * Compute the centroid and store the value in the given out parameter.
   */
  void computeCentroidToOut(List<Vector> vs, int count, Vector out) {
    assert (count >= 3);

    out.setCoords(0.0, 0.0);
    num area = 0.0;

    if (count == 2) {
      out.setFrom(vs[0]).addLocal(vs[1]).mulLocal(.5);
      return;
    }

    // pRef is the reference point for forming triangles.
    // It's location doesn't change the result (except for rounding error).
    final Vector pRef = vectorPool[0];
    pRef.setZero();

    final Vector e1 = vectorPool[1];
    final Vector e2 = vectorPool[2];

    final num inv3 = 1.0 / 3.0;

    for (int i = 0; i < count; ++i) {
      // Triangle vertices.
      final Vector p1 = pRef;
      final Vector p2 = vs[i];
      final Vector p3 = i + 1 < count ? vs[i + 1] : vs[0];

      e1.setFrom(p2).subLocal(p1);
      e2.setFrom(p3).subLocal(p1);

      final num D = Vector.crossVectors(e1, e2);

      final num triangleArea = 0.5 * D;
      area += triangleArea;

      // Area weighted centroid
      out.addLocal(p1).addLocal(p2).addLocal(p3).mulLocal(triangleArea * inv3);
    }

    // Centroid
    assert (area > Settings.EPSILON);
    out.mulLocal(1.0 / area);
  }

  /**
   * See Shape.computeMass(MassData)
   */
  void computeMass(MassData massData, num density) {
    // Polygon mass, centroid, and inertia.
    // Let rho be the polygon density in mass per unit area.
    // Then:
    // mass = rho * int(dA)
    // centroid.x = (1/mass) * rho * int(x * dA)
    // centroid.y = (1/mass) * rho * int(y * dA)
    // I = rho * int((x*x + y*y) * dA)
    //
    // We can compute these integrals by summing all the integrals
    // for each triangle of the polygon. To evaluate the integral
    // for a single triangle, we make a change of variables to
    // the (u,v) coordinates of the triangle:
    // x = x0 + e1x * u + e2x * v
    // y = y0 + e1y * u + e2y * v
    // where 0 <= u && 0 <= v && u + v <= 1.
    //
    // We integrate u from [0,1-v] and then v from [0,1].
    // We also need to use the Jacobian of the transformation:
    // D = cross(e1, e2)
    //
    // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
    //
    // The rest of the derivation is handled by computer algebra.

    assert (vertexCount >= 2);

    // A line segment has zero mass.
    if (vertexCount == 2) {
      // massData.center = 0.5 * (vertices[0] + vertices[1]);
      massData.center.setFrom(vertices[0]).addLocal(vertices[1]).
          mulLocal(0.5);
      massData.mass = 0.0;
      massData.inertia = 0.0;
      return;
    }

    final Vector center = vectorPool[0];
    center.setZero();
    num area = 0.0;
    num I = 0.0;

    // pRef is the reference point for forming triangles.
    // It's location doesn't change the result (except for rounding error).
    final Vector pRef = vectorPool[1];
    pRef.setZero();

    final num k_inv3 = 1.0 / 3.0;

    final Vector e1 = vectorPool[2];
    final Vector e2 = vectorPool[3];

    for (int i = 0; i < vertexCount; ++i) {
      // Triangle vertices.
      final Vector p1 = pRef;
      final Vector p2 = vertices[i];
      final Vector p3 = i + 1 < vertexCount ? vertices[i + 1] : vertices[0];

      e1.setFrom(p2);
      e1.subLocal(p1);

      e2.setFrom(p3);
      e2.subLocal(p1);

      final num D = Vector.crossVectors(e1, e2);

      final num triangleArea = 0.5 * D;
      area += triangleArea;

      // Area weighted centroid
      center.x += triangleArea * k_inv3 * (p1.x + p2.x + p3.x);
      center.y += triangleArea * k_inv3 * (p1.y + p2.y + p3.y);

      final num px = p1.x;
      final num py = p1.y;
      final num ex1 = e1.x;
      final num ey1 = e1.y;
      final num ex2 = e2.x;
      final num ey2 = e2.y;

      final num intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) +
          (px * ex1 + px * ex2)) + 0.5 * px * px;
      final num inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) +
          (py * ey1 + py * ey2)) + 0.5 * py * py;

      I += D * (intx2 + inty2);
    }

    // Total mass
    massData.mass = density * area;

    // Center of mass
    assert (area > Settings.EPSILON);
    center.mulLocal(1.0 / area);
    massData.center.setFrom(center);

    // Inertia tensor relative to the local origin.
    massData.inertia = I * density;
  }

  /**
   * Get the centroid and apply the supplied transform.
   */
  Vector applyTransformToCentroid(Transform xf) {
    return Transform.mul(xf, centroid);
  }

  /**
   * Get the centroid and apply the supplied transform. Return the result
   * through the return parameter out.
   */
  Vector centroidToOut(Transform xf, Vector out) {
    Transform.mulToOut(xf, centroid, out);
    return out;
  }
}
