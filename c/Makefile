CC = gcc
CFLAGS = -g -O3 -IBox2D_v2.2.1 -DNDEBUG=1
LFLAGS = -lstdc++

EMMAKEN = /Users/jgw/src/emscripten/tools/emmaken.py
EMSCRIPTEN = /Users/jgw/src/emscripten/emscripten.py
EMMAKEN_FLAGS = -I Box2D_v2.2.1 -DNDEBUG=1
EMSCRIPTEN_FLAGS = --optimize -s RELOP=1 -s USE_TYPED_ARRAYS=1 -s SAFE_HEAP=0 -s ASSERTIONS=0 -s QUANTUM_SIZE=1 \
 -s SKIP_STACK_IN_SMALL=1 -s INIT_STACK=0 -s PGO=0 -s CHECK_OVERFLOWS=0 -s CHECK_SIGNED_OVERFLOWS=0 \
 -s CORRECT_OVERFLOWS=0 -s CHCK_SIGNS=0 -s CORRECT_SIGNS=0 -s CORRECT_ROUNDINGS=0 -s MICRO_OPTS=0 \
 -s DISABLE_EXCEPTION_CATCHING=1 -s RUNTYPE_TYPE_INFO=0

OBJECTS = out/Bench2d.o \
out/Box2D_v2.2.1/Box2d/Collision/b2BroadPhase.o \
out/Box2D_v2.2.1/Box2d/Collision/b2CollideCircle.o \
out/Box2D_v2.2.1/Box2d/Collision/b2CollideEdge.o \
out/Box2D_v2.2.1/Box2d/Collision/b2CollidePolygon.o \
out/Box2D_v2.2.1/Box2d/Collision/b2Collision.o \
out/Box2D_v2.2.1/Box2d/Collision/b2Distance.o \
out/Box2D_v2.2.1/Box2d/Collision/b2DynamicTree.o \
out/Box2D_v2.2.1/Box2d/Collision/b2TimeOfImpact.o \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2ChainShape.o \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2CircleShape.o \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2EdgeShape.o \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2PolygonShape.o \
out/Box2D_v2.2.1/Box2d/Common/b2BlockAllocator.o \
out/Box2D_v2.2.1/Box2d/Common/b2Draw.o \
out/Box2D_v2.2.1/Box2d/Common/b2Math.o \
out/Box2D_v2.2.1/Box2d/Common/b2Settings.o \
out/Box2D_v2.2.1/Box2d/Common/b2StackAllocator.o \
out/Box2D_v2.2.1/Box2d/Common/b2Timer.o \
out/Box2D_v2.2.1/Box2d/Dynamics/b2Body.o \
out/Box2D_v2.2.1/Box2d/Dynamics/b2ContactManager.o \
out/Box2D_v2.2.1/Box2d/Dynamics/b2Fixture.o \
out/Box2D_v2.2.1/Box2d/Dynamics/b2Island.o \
out/Box2D_v2.2.1/Box2d/Dynamics/b2World.o \
out/Box2D_v2.2.1/Box2d/Dynamics/b2WorldCallbacks.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndCircleContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndPolygonContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2CircleContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2Contact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ContactSolver.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndCircleContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndPolygonContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonAndCircleContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonContact.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2DistanceJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2FrictionJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2GearJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2Joint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2MouseJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PrismaticJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PulleyJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RevoluteJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RopeJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WeldJoint.o \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WheelJoint.o \
out/Box2D_v2.2.1/Box2d/Rope/b2Rope.o

BCOBJECTS = out/Bench2d.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2BroadPhase.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2CollideCircle.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2CollideEdge.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2CollidePolygon.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2Collision.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2Distance.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2DynamicTree.bc \
out/Box2D_v2.2.1/Box2d/Collision/b2TimeOfImpact.bc \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2ChainShape.bc \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2CircleShape.bc \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2EdgeShape.bc \
out/Box2D_v2.2.1/Box2d/Collision/Shapes/b2PolygonShape.bc \
out/Box2D_v2.2.1/Box2d/Common/b2BlockAllocator.bc \
out/Box2D_v2.2.1/Box2d/Common/b2Draw.bc \
out/Box2D_v2.2.1/Box2d/Common/b2Math.bc \
out/Box2D_v2.2.1/Box2d/Common/b2Settings.bc \
out/Box2D_v2.2.1/Box2d/Common/b2StackAllocator.bc \
out/Box2D_v2.2.1/Box2d/Common/b2Timer.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/b2Body.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/b2ContactManager.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/b2Fixture.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/b2Island.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/b2World.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/b2WorldCallbacks.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndCircleContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndPolygonContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2CircleContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2Contact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ContactSolver.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndCircleContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndPolygonContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonAndCircleContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonContact.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2DistanceJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2FrictionJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2GearJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2Joint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2MouseJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PrismaticJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PulleyJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RevoluteJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RopeJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WeldJoint.bc \
out/Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WheelJoint.bc \
out/Box2D_v2.2.1/Box2d/Rope/b2Rope.bc

out/bench2d : mkdirs $(OBJECTS)
	$(CC) $(LFLAGS) $(OBJECTS) -o out/bench2d

out/bench2d.llvm.bc : mkdirs $(BCOBJECTS)
	$(EMMAKEN) $(BCOBJECTS) -o out/bench2d.llvm

out/bench2d.js : out/bench2d.llvm.bc
	$(EMSCRIPTEN) $(EMSCRIPTEN_FLAGS) out/bench2d.llvm.bc -o out/bench2d.js

out/%.o : %.cpp
	$(CC) $(CFLAGS) -o $@ -c $<

out/%.bc : %.cpp
	$(EMMAKEN) $(EMMAKEN_FLAGS) -o $@ $<

mkdirs : $(shell test -d out || mkdir -p out)
  $(shell test -d out/Box2d_v2.2.1 || mkdir -p out/Box2d_v2.2.1)
  $(shell test -d out/Box2d_v2.2.1/Box2d || mkdir -p out/Box2d_v2.2.1/Box2d)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Collision || mkdir -p out/Box2d_v2.2.1/Box2d/Collision)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Collision/Shapes || mkdir -p out/Box2d_v2.2.1/Box2d/Collision/Shapes)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Common || mkdir -p out/Box2d_v2.2.1/Box2d/Common)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Dynamics || mkdir -p out/Box2d_v2.2.1/Box2d/Dynamics)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Dynamics/Contacts || mkdir -p out/Box2d_v2.2.1/Box2d/Dynamics/Contacts)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Dynamics/Joints || mkdir -p out/Box2d_v2.2.1/Box2d/Dynamics/Joints)
  $(shell test -d out/Box2d_v2.2.1/Box2d/Rope || mkdir -p out/Box2d_v2.2.1/Box2d/Rope)

