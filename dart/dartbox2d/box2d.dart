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
#library('box2d');
#import('dart:dom');

#source('collision/AxisAlignedBox.dart');
#source('collision/Collision.dart');
#source('collision/ContactID.dart');
#source('collision/Distance.dart');
#source('collision/DistanceInput.dart');
#source('collision/DistanceOutput.dart');
#source('collision/DistanceProxy.dart');
#source('collision/Features.dart');
#source('collision/Manifold.dart');
#source('collision/ManifoldPoint.dart');
#source('collision/ManifoldType.dart');
#source('collision/PointState.dart');
#source('collision/Simplex.dart');
#source('collision/SimplexCache.dart');
#source('collision/SimplexVertex.dart');
#source('collision/TimeOfImpact.dart');
#source('collision/WorldManifold.dart');
#source('collision/broadphase/BroadPhase.dart');
#source('collision/broadphase/DynamicTree.dart');
#source('collision/broadphase/DynamicTreeNode.dart');
#source('collision/broadphase/Pair.dart');
#source('collision/shapes/CircleShape.dart');
#source('collision/shapes/MassData.dart');
#source('collision/shapes/PolygonShape.dart');
#source('collision/shapes/Shape.dart');
#source('collision/shapes/ShapeType.dart');
#source('callbacks/CanvasDraw.dart');
#source('callbacks/PairCallback.dart');
#source('callbacks/TreeCallback.dart');
#source('callbacks/ContactListener.dart');
#source('callbacks/ContactFilter.dart');
#source('callbacks/ContactImpulse.dart');
#source('callbacks/QueryCallback.dart');
#source('callbacks/DebugDraw.dart');
#source('callbacks/DestructionListener.dart');
#source('dynamics/Body.dart');
#source('dynamics/BodyDef.dart');
#source('dynamics/BodyType.dart');
#source('dynamics/ContactManager.dart');
#source('dynamics/Filter.dart');
#source('dynamics/Fixture.dart');
#source('dynamics/FixtureDef.dart');
#source('dynamics/Island.dart');
#source('dynamics/TimeStep.dart');
#source('dynamics/World.dart');
#source('dynamics/contacts/Contact.dart');
#source('dynamics/contacts/ContactConstraint.dart');
#source('dynamics/contacts/ContactConstraintPoint.dart');
#source('dynamics/contacts/ContactEdge.dart');
#source('dynamics/contacts/ContactCreator.dart');
#source('dynamics/contacts/CircleContact.dart');
#source('dynamics/contacts/ContactRegister.dart');
#source('dynamics/contacts/ContactSolver.dart');
#source('dynamics/contacts/PolygonAndCircleContact.dart');
#source('dynamics/contacts/PolygonContact.dart');
#source('dynamics/contacts/TimeOfImpactSolver.dart');
#source('dynamics/contacts/TimeOfImpactConstraint.dart');
#source('dynamics/joints/Joint.dart');
#source('dynamics/joints/JointEdge.dart');
#source('dynamics/joints/JointDef.dart');
#source('dynamics/joints/JointType.dart');
#source('dynamics/joints/LimitState.dart');
#source('dynamics/joints/ConstantVolumeJoint.dart');
#source('dynamics/joints/ConstantVolumeJointDef.dart');
#source('dynamics/joints/DistanceJoint.dart');
#source('dynamics/joints/DistanceJointDef.dart');
#source('dynamics/joints/RevoluteJoint.dart');
#source('dynamics/joints/RevoluteJointDef.dart');
#source('pooling/DefaultWorldPool.dart');
#source('common/Color3.dart');
#source('common/IViewportTransform.dart');
#source('common/MathBox.dart');
#source('common/CanvasViewportTransform.dart');
#source('common/Matrix22.dart');
#source('common/Matrix33.dart');
#source('common/Settings.dart');
#source('common/Sweep.dart');
#source('common/Transform.dart');
#source('common/Vector.dart');
#source('common/Vector3.dart');

