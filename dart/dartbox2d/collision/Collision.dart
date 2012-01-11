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
 * Functions used for computing contact points, distance
 * queries, and time of impact (TimeOfImpact) queries. Collision methods are non-static
 * for pooling speed, retrieve a collision object from the [SingletonPool].
 */
class Collision {
  static final int NULL_FEATURE = Settings.MAX_INTEGER;

  final DefaultWorldPool _pool;

  /** Cache used to help warmstart distance. */
  final SimplexCache cache;

  /** Distance input and output. */
  final DistanceInput input;
  final DistanceOutput output;

  /** A pool of already constructed objects. */
  final EdgeResults results1;
  final EdgeResults results2;
  final List<ClipVertex> incidentEdge;
  final Vector localTangent;
  final Vector localNormal;
  final Vector planePoint;
  final Vector tangent;
  final Vector normal;
  final Vector normal1;
  final Vector v11;
  final Vector v12;
  final List<ClipVertex> clipPoints1;
  final List<ClipVertex> clipPoints2;

  /**
   * Constructs a new Collision object. Should only be constructed once (in the
   * pool). Retrieve from the pool to use.
   */
  Collision._construct(DefaultWorldPool pool) :
    _pool = pool,
    input = new DistanceInput(),
    cache = new SimplexCache(),
    output = new DistanceOutput(),
    results1 = new EdgeResults(),
    results2 = new EdgeResults(),
    incidentEdge = new List<ClipVertex>(2),
    localTangent = new Vector(),
    localNormal = new Vector(),
    planePoint = new Vector(),
    tangent = new Vector(),
    normal = new Vector(),
    normal1 = new Vector(),
    v11 = new Vector(),
    v12 = new Vector(),
    clipPoints1 = new List<ClipVertex>(2),
    clipPoints2 = new List<ClipVertex>(2) {
    incidentEdge[0] = new ClipVertex();
    incidentEdge[1] = new ClipVertex();
    clipPoints1[0] = new ClipVertex();
    clipPoints1[1] = new ClipVertex();
    clipPoints2[0] = new ClipVertex();
    clipPoints2[1] = new ClipVertex();
  }

  /**
   * Returns true if the two given shapes overlap.
   */
  bool testOverlap(Shape shapeA, Shape shapeB, Transform transformA,
      Transform transformB) {
    input.proxyA.setFromShape(shapeA);
    input.proxyB.setFromShape(shapeB);
    input.transformA.setFrom(transformA);
    input.transformB.setFrom(transformB);
    input.useRadii = true;

    cache.count = 0;

    _pool.distance.distance(output, cache, input);
    return output.distance < 10.0 * Settings.EPSILON;
  }

  /**
   * Compute the point states given two manifolds. The states pertain to the
   * transition from manifold1 to manifold2. So state1 is either persist or
   * remove while state2 is either add or persist.
   */
  void getPointStates(List<int> state1, List<int> state2,
      Manifold manifold1, Manifold manifold2) {
    for (int i = 0; i < Settings.MAX_MANIFOLD_POINTS; i++) {
      state1[i] = PointState.NULL_STATE;
      state2[i] = PointState.NULL_STATE;
    }

    // Detect persists and removes.
    for (int i = 0; i < manifold1.pointCount; i++) {
      ContactID id = manifold1.points[i].id;

      state1[i] = PointState.REMOVE_STATE;

      for (int j = 0; j < manifold2.pointCount; j++) {
        if (manifold2.points[j].id.isEqual(id)) {
          state1[i] = PointState.PERSIST_STATE;
          break;
        }
      }
    }

    // Detect persists and adds
    for (int i = 0; i < manifold2.pointCount; i++) {
      ContactID id = manifold2.points[i].id;

      state2[i] = PointState.ADD_STATE;

      for (int j = 0; j < manifold1.pointCount; j++) {
        if (manifold1.points[j].id.isEqual(id)) {
          state2[i] = PointState.PERSIST_STATE;
          break;
        }
      }
    }
  }

  /**
   * Clipping for contact manifolds.
   * Sutherland-Hodgman clipping.
   */
  static int clipSegmentToLine(List<ClipVertex> vOut, List<ClipVertex> vIn,
      Vector norm, num offset) {

    // Start with no output points
    int numOut = 0;

    // Calculate the distance of end points to the line
    num distance0 = Vector.dot(norm, vIn[0].v) - offset;
    num distance1 = Vector.dot(norm, vIn[1].v) - offset;

    // If the points are behind the plane
    if (distance0 <= 0.0) {
      vOut[numOut++].setFrom(vIn[0]);
    }
    if (distance1 <= 0.0) {
      vOut[numOut++].setFrom(vIn[1]);
    }

    // If the points are on different sides of the plane
    if (distance0 * distance1 < 0.0) {
      // Find intersection point of edge and plane
      num interp = distance0 / (distance0 - distance1);
      // vOut[numOut].v = vIn[0].v + interp * (vIn[1].v - vIn[0].v);
      vOut[numOut].v.setFrom(vIn[1].v).
          subLocal(vIn[0].v).mulLocal(interp).addLocal(vIn[0].v);
      if (distance0 > 0.0) {
        vOut[numOut].id.setFrom(vIn[0].id);
      } else {
        vOut[numOut].id.setFrom(vIn[1].id);
      }
      ++numOut;
    }

    return numOut;
  }

  /**
   * Compute the collision manifold between two circles.
   *
   */
  //TODO(gregbglw): Consider introducing operator overloading for matrix/vector
  //operations and then replace many of the inlined calculations with those.
  void collideCircles(Manifold manifold, CircleShape circle1, Transform xfA,
      CircleShape circle2, Transform xfB) {
    manifold.pointCount = 0;

    final Vector v = circle1.position;
    final num pAy = xfA.position.y + xfA.rotation.col1.y *
        v.x + xfA.rotation.col2.y * v.y;

    final num pAx = xfA.position.x + xfA.rotation.col1.x *
        v.x + xfA.rotation.col2.x * v.y;

    final Vector v1 = circle2.position;
    final num pBy = xfB.position.y + xfB.rotation.col1.y * v1.x +
        xfB.rotation.col2.y * v1.y;
    final num pBx = xfB.position.x + xfB.rotation.col1.x * v1.x +
        xfB.rotation.col2.x * v1.y;

    final num dx = pBx - pAx;
    final num dy = pBy - pAy;

    final num distSqr = dx * dx + dy * dy;

    final num radius = circle1.radius + circle2.radius;
    if (distSqr > radius * radius) {
      return;
    }

    manifold.type = ManifoldType.CIRCLES;
    manifold.localPoint.setFrom(circle1.position);
    manifold.localNormal.setZero();
    manifold.pointCount = 1;

    manifold.points[0].localPoint.setFrom(circle2.position);
    manifold.points[0].id.zero();
  }

  /**
   * Compute the collision manifold between a polygon and a circle.
   */
  void collidePolygonAndCircle(Manifold manifold, PolygonShape polygon,
      Transform xfA, CircleShape circle, Transform xfB) {
    manifold.pointCount = 0;
    Vector v = circle.position;

    final num cy = xfB.position.y + xfB.rotation.col1.y * v.x +
        xfB.rotation.col2.y * v.y;
    final num cx = xfB.position.x + xfB.rotation.col1.x * v.x +
        xfB.rotation.col2.x * v.y;
    final num v1x = cx - xfA.position.x;
    final num v1y = cy - xfA.position.y;
    final Vector b = xfA.rotation.col1;
    final Vector b1 = xfA.rotation.col2;
    final num cLocaly = v1x * b1.x + v1y * b1.y;
    final num cLocalx = v1x * b.x + v1y * b.y;

    // Find the min separating edge.
    int normalIndex = 0;
    num separation = Settings.SMALL_NUMBER;
    final num radius = polygon.radius + circle.radius;
    final int vertexCount = polygon.vertexCount;

    final List<Vector> vertices = polygon.vertices;
    final List<Vector> normals = polygon.normals;

    for (int i = 0; i < vertexCount; i++) {
      final Vector vertex = vertices[i];
      final num tempx = cLocalx - vertex.x;
      final num tempy = cLocaly - vertex.y;
      final Vector norm = normals[i];
      final num s = norm.x * tempx + norm.y * tempy;

      if (s > radius) {
        // early out
        return;
      }

      if (s > separation) {
        separation = s;
        normalIndex = i;
      }
    }

    // Vertices that subtend the incident face.
    final int vertIndex1 = normalIndex;
    final int vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
    final Vector v1 = vertices[vertIndex1];
    final Vector v2 = vertices[vertIndex2];

    // If the center is inside the polygon ...
    if (separation < Settings.EPSILON) {
      manifold.pointCount = 1;
      manifold.type = ManifoldType.FACE_A;

      Vector norm = normals[normalIndex];
      manifold.localNormal.x = norm.x;
      manifold.localNormal.y = norm.y;
      manifold.localPoint.x = (v1.x + v2.x) * .5;
      manifold.localPoint.y = (v1.y + v2.y) * .5;
      ManifoldPoint mpoint = manifold.points[0];
      mpoint.localPoint.x = circle.position.x;
      mpoint.localPoint.y = circle.position.y;
      mpoint.id.zero();
      return;
    }

    // Compute barycentric coordinates
    final num tempX = cLocalx - v1.x;
    final num tempY = cLocaly - v1.y;
    final num temp2X = v2.x - v1.x;
    final num temp2Y = v2.y - v1.y;
    final num u1 = tempX * temp2X + tempY * temp2Y;

    final num temp3X = cLocalx - v2.x;
    final num temp3Y = cLocaly - v2.y;
    final num temp4X = v1.x - v2.x;
    final num temp4Y = v1.y - v2.y;
    final num u2 = temp3X * temp4X + temp3Y * temp4Y;

    if (u1 <= 0) {
      final num dx = cLocalx - v1.x;
      final num dy = cLocaly - v1.y;
      if ( dx * dx + dy * dy > radius * radius) {
        return;
      }

      manifold.pointCount = 1;
      manifold.type = ManifoldType.FACE_A;
      manifold.localNormal.x = cLocalx - v1.x;
      manifold.localNormal.y = cLocaly - v1.y;
      manifold.localNormal.normalize();
      manifold.localPoint.setFrom(v1);
      manifold.points[0].localPoint.setFrom(circle.position);
      manifold.points[0].id.zero();
    } else if (u2 <= 0.0) {
      final num dx = cLocalx - v2.x;
      final num dy = cLocaly - v2.y;
      if ( dx * dx + dy * dy > radius * radius) {
        return;
      }

      manifold.pointCount = 1;
      manifold.type = ManifoldType.FACE_A;
      manifold.localNormal.x = cLocalx - v2.x;
      manifold.localNormal.y = cLocaly - v2.y;
      manifold.localNormal.normalize();
      manifold.localPoint.setFrom(v2);
      manifold.points[0].localPoint.setFrom(circle.position);
      manifold.points[0].id.zero();
    } else {
      // Vector faceCenter = 0.5 * (v1 + v2);
      // (temp is faceCenter)
      final num fcx = (v1.x + v2.x) * .5;
      final num fcy = (v1.y + v2.y) * .5;

      final num tx = cLocalx - fcx;
      final num ty = cLocaly - fcy;
      final Vector norm = normals[vertIndex1];
      separation = tx * norm.x + ty * norm.y;
      if(separation > radius){
        return;
      }

      manifold.pointCount = 1;
      manifold.type = ManifoldType.FACE_A;
      manifold.localNormal.setFrom(normals[vertIndex1]);
      manifold.localPoint.x = fcx;
      manifold.localPoint.y = fcy;
      manifold.points[0].localPoint.setFrom(circle.position);
      manifold.points[0].id.zero();
    }
  }

  /**
   * Find the separation between poly1 and poly2 for a given edge normal on
   * poly1.
   */
  num edgeSeparation(PolygonShape poly1, Transform xf1, int edge1,
      PolygonShape poly2, Transform xf2) {
    final int count1 = poly1.vertexCount;
    final List<Vector> vertices1 = poly1.vertices;
    final List<Vector> normals1 = poly1.normals;

    final int count2 = poly2.vertexCount;
    final List<Vector> vertices2 = poly2.vertices;

    assert (0 <= edge1 && edge1 < count1);
    // Convert normal from poly1's frame into poly2's frame.
    final Matrix22 R = xf1.rotation;
    final Vector v = normals1[edge1];
    final num normal1Worldy = R.col1.y * v.x + R.col2.y * v.y;
    final num normal1Worldx = R.col1.x * v.x + R.col2.x * v.y;
    final Matrix22 R1 = xf2.rotation;
    final num normal1x = normal1Worldx * R1.col1.x + normal1Worldy * R1.col1.y;
    final num normal1y = normal1Worldx * R1.col2.x + normal1Worldy * R1.col2.y;
    // end inline

    // Find support vertex on poly2 for -normal.
    int index = 0;
    num minDot = Settings.BIG_NUMBER;

    for (int i = 0; i < count2; ++i) {
      final Vector a = vertices2[i];
      final num dot = a.x * normal1x + a.y * normal1y;
      if (dot < minDot) {
        minDot = dot;
        index = i;
      }
    }

    final Vector v3 = vertices1[edge1];
    final num v1y = xf1.position.y + R.col1.y * v3.x + R.col2.y * v3.y;
    final num v1x = xf1.position.x + R.col1.x * v3.x + R.col2.x * v3.y;
    final Vector v4 = vertices2[index];
    final num v2y = xf2.position.y + R1.col1.y * v4.x + R1.col2.y * v4.y - v1y;
    final num v2x = xf2.position.x + R1.col1.x * v4.x + R1.col2.x * v4.y - v1x;

    return v2x * normal1Worldx + v2y * normal1Worldy;
  }

  /**
   * Find the max separation between poly1 and poly2 using edge normals from
   * poly1.
   */
  void findMaxSeparation(EdgeResults results, PolygonShape poly1, Transform xf1,
      PolygonShape poly2, Transform xf2) {
    int count1 = poly1.vertexCount;
    final List<Vector> normals1 = poly1.normals;
    Vector v = poly2.centroid;

    final num predy = xf2.position.y + xf2.rotation.col1.y * v.x +
        xf2.rotation.col2.y * v.y;
    final num predx = xf2.position.x + xf2.rotation.col1.x * v.x +
        xf2.rotation.col2.x * v.y;
    final Vector v1 = poly1.centroid;
    final num tempy = xf1.position.y + xf1.rotation.col1.y * v1.x +
        xf1.rotation.col2.y * v1.y;
    final num tempx = xf1.position.x + xf1.rotation.col1.x * v1.x +
        xf1.rotation.col2.x * v1.y;
    final num dx = predx - tempx;
    final num dy = predy - tempy;

    final Matrix22 R = xf1.rotation;
    final num dLocal1x = dx * R.col1.x + dy * R.col1.y;
    final num dLocal1y = dx * R.col2.x + dy * R.col2.y;

    // Find edge normal on poly1 that has the largest projection onto d.
    int edge = 0;
    num dot;
    num maxDot = Settings.SMALL_NUMBER;
    for (int i = 0; i < count1; i++) {
      final Vector norm = normals1[i];
      dot = norm.x * dLocal1x + norm.y * dLocal1y;
      if (dot > maxDot) {
        maxDot = dot;
        edge = i;
      }
    }

    // Get the separation for the edge normal.
    num s = edgeSeparation(poly1, xf1, edge, poly2, xf2);

    // Check the separation for the previous edge normal.
    int prevEdge = edge - 1 >= 0 ? edge - 1 : count1 - 1;
    num sPrev = edgeSeparation(poly1, xf1, prevEdge, poly2, xf2);

    // Check the separation for the next edge normal.
    int nextEdge = edge + 1 < count1 ? edge + 1 : 0;
    num sNext = edgeSeparation(poly1, xf1, nextEdge, poly2, xf2);

    // Find the best edge and the search direction.
    int bestEdge;
    num bestSeparation;
    int increment;
    if (sPrev > s && sPrev > sNext) {
      increment = -1;
      bestEdge = prevEdge;
      bestSeparation = sPrev;
    } else if (sNext > s) {
      increment = 1;
      bestEdge = nextEdge;
      bestSeparation = sNext;
    } else {
      results.edgeIndex = edge;
      results.separation = s;
      return;
    }

    // Perform a local search for the best edge normal.
    while (true) {
      if (increment == -1) {
        edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
      } else {
        edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;
      }

      s = edgeSeparation(poly1, xf1, edge, poly2, xf2);

      if (s > bestSeparation) {
        bestEdge = edge;
        bestSeparation = s;
      } else {
        break;
      }
    }

    results.edgeIndex = bestEdge;
    results.separation = bestSeparation;
  }

  void findIncidentEdge(List<ClipVertex> c, PolygonShape poly1, Transform xf1,
      int edge1, PolygonShape poly2, Transform xf2) {
    int count1 = poly1.vertexCount;
    final List<Vector> normals1 = poly1.normals;

    int count2 = poly2.vertexCount;
    final List<Vector> vertices2 = poly2.vertices;
    final List<Vector> normals2 = poly2.normals;

    assert (0 <= edge1 && edge1 < count1);

    // Get the normal of the reference edge in poly2's frame.
    Matrix22.mulMatrixAndVectorToOut(xf1.rotation, normals1[edge1], normal1);
    Matrix22.mulTransMatrixAndVectorToOut(xf2.rotation, normal1, normal1);

    // Find the incident edge on poly2.
    int index = 0;
    num minDot = Settings.BIG_NUMBER;
    for (int i = 0; i < count2; ++i) {
      num dot = Vector.dot(normal1, normals2[i]);
      if (dot < minDot) {
        minDot = dot;
        index = i;
      }
    }

    // Build the clip vertices for the incident edge.
    int i1 = index;
    int i2 = i1 + 1 < count2 ? i1 + 1 : 0;

    Transform.mulToOut(xf2, vertices2[i1], c[0].v);
    c[0].id.features.referenceEdge = edge1;
    c[0].id.features.incidentEdge = i1;
    c[0].id.features.incidentVertex = 0;

    Transform.mulToOut(xf2, vertices2[i2], c[1].v);
    c[1].id.features.referenceEdge = edge1;
    c[1].id.features.incidentEdge = i2;
    c[1].id.features.incidentVertex = 1;
  }

  /**
   * Compute the collision manifold between two polygons.
   */
  void collidePolygons(Manifold manifold, PolygonShape polyA, Transform xfA,
     PolygonShape polyB, Transform xfB) {

    manifold.pointCount = 0;
    num totalRadius = polyA.radius + polyB.radius;

    findMaxSeparation(results1, polyA, xfA, polyB, xfB);
    if (results1.separation > totalRadius) {
      return;
    }

    findMaxSeparation(results2, polyB, xfB, polyA, xfA);
    if (results2.separation > totalRadius) {
      return;
    }

    PolygonShape poly1; // reference polygon
    PolygonShape poly2; // incident polygon
    Transform xf1, xf2;
    int edge1; // reference edge
    int flip;
    num k_relativeTol = 0.98;
    num k_absoluteTol = 0.001;

    if (results2.separation > k_relativeTol * results1.separation +
        k_absoluteTol) {
      poly1 = polyB;
      poly2 = polyA;
      xf1 = xfB;
      xf2 = xfA;
      edge1 = results2.edgeIndex;
      manifold.type = ManifoldType.FACE_B;
      flip = 1;
    } else {
      poly1 = polyA;
      poly2 = polyB;
      xf1 = xfA;
      xf2 = xfB;
      edge1 = results1.edgeIndex;
      manifold.type = ManifoldType.FACE_A;
      flip = 0;
    }

    findIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);

    int count1 = poly1.vertexCount;
    List<Vector> vertices1 = poly1.vertices;

    v11.setFrom(vertices1[edge1]);
    v12.setFrom(edge1 + 1 < count1 ? vertices1[edge1 + 1] : vertices1[0]);

    localTangent.setFrom(v12).subLocal(v11);
    localTangent.normalize();

    // Vector localNormal = Cross(dv, 1.0);
    Vector.crossVectorAndNumToOut(localTangent, 1, localNormal);

    // Vector planePoint = 0.5 * (v11 + v12)
    planePoint.setFrom(v11).addLocal(v12).mulLocal(.5);

    // Vector sideNormal = Mul(xf1.rotation, v12 - v11);
    Matrix22.mulMatrixAndVectorToOut(xf1.rotation, localTangent, tangent);

    // Vector frontNormal = Cross(sideNormal, 1.0);
    Vector.crossVectorAndNumToOut(tangent, 1, normal);

    // v11 = Mul(xf1, v11);
    // v12 = Mul(xf1, v12);
    Transform.mulToOut(xf1, v11, v11);
    Transform.mulToOut(xf1, v12, v12);

    // Face offset
    num frontOffset = Vector.dot(normal, v11);

    // Side offsets, extended by polytope skin thickness.
    num sideOffset1 = -Vector.dot(tangent, v11) + totalRadius;
    num sideOffset2 = Vector.dot(tangent, v12) + totalRadius;

    // Clip incident edge against extruded edge1 side edges.
    // ClipVertex clipPoints1[2];
    // ClipVertex clipPoints2[2];
    int np;

    // Clip to box side 1
    // np = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormal,
    // sideOffset1);
    tangent.negateLocal();
    np = clipSegmentToLine(clipPoints1, incidentEdge, tangent, sideOffset1);
    tangent.negateLocal();

    if (np < 2) {
      return;
    }

    // Clip to negative box side 1
    np = clipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2);

    if (np < 2) {
      return;
    }

    // Now clipPoints2 contains the clipped points.
    manifold.localNormal.setFrom(localNormal);
    manifold.localPoint.setFrom(planePoint);

    int pointCount = 0;
    for (int i = 0; i < Settings.MAX_MANIFOLD_POINTS; ++i) {
      num separation = Vector.dot(normal, clipPoints2[i].v) - frontOffset;

      if (separation <= totalRadius) {
        ManifoldPoint cp = manifold.points[pointCount];
        Transform.mulTransToOut(xf2, clipPoints2[i].v, cp.localPoint);
        // cp.localPoint = MulT(xf2, clipPoints2[i].v);
        cp.id.setFrom(clipPoints2[i].id);
        cp.id.features.flip = flip;
        ++pointCount;
      }
    }

    manifold.pointCount = pointCount;
  }
}

/**
 * Used for computing contact manifolds.
 */
class ClipVertex {
  Vector v;
  ContactID id;

  ClipVertex() {
    v = new Vector();
    id = new ContactID();
  }

  void setFrom(ClipVertex cv){
    v.setFrom(cv.v);
    id.setFrom(cv.id);
  }
}

/**
 * Class for returning edge results
 */
class EdgeResults {
  num separation;
  int edgeIndex;

  EdgeResults()
    :separation = 0,
    edgeIndex = 0 { }
}
