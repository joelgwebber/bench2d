# Makefile for generating Javascript from the C++ source, using Emscripten.

# You'll likely need to edit these for your particular directory layout.
EMCC=$(EMSCRIPTEN)/emcc -IBox2D_v2.2.1 -DNDEBUG=1
HEAP=67108864

OBJECTS = \
bench2d_main.bc \
Bench2d.bc \
Box2D_v2.2.1/Box2D/Collision/b2BroadPhase.bc \
Box2D_v2.2.1/Box2D/Collision/b2CollideCircle.bc \
Box2D_v2.2.1/Box2D/Collision/b2CollideEdge.bc \
Box2D_v2.2.1/Box2D/Collision/b2CollidePolygon.bc \
Box2D_v2.2.1/Box2D/Collision/b2Collision.bc \
Box2D_v2.2.1/Box2D/Collision/b2Distance.bc \
Box2D_v2.2.1/Box2D/Collision/b2DynamicTree.bc \
Box2D_v2.2.1/Box2D/Collision/b2TimeOfImpact.bc \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2ChainShape.bc \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2CircleShape.bc \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2EdgeShape.bc \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2PolygonShape.bc \
Box2D_v2.2.1/Box2D/Common/b2BlockAllocator.bc \
Box2D_v2.2.1/Box2D/Common/b2Draw.bc \
Box2D_v2.2.1/Box2D/Common/b2Math.bc \
Box2D_v2.2.1/Box2D/Common/b2Settings.bc \
Box2D_v2.2.1/Box2D/Common/b2StackAllocator.bc \
Box2D_v2.2.1/Box2D/Common/b2Timer.bc \
Box2D_v2.2.1/Box2D/Dynamics/b2Body.bc \
Box2D_v2.2.1/Box2D/Dynamics/b2ContactManager.bc \
Box2D_v2.2.1/Box2D/Dynamics/b2Fixture.bc \
Box2D_v2.2.1/Box2D/Dynamics/b2Island.bc \
Box2D_v2.2.1/Box2D/Dynamics/b2World.bc \
Box2D_v2.2.1/Box2D/Dynamics/b2WorldCallbacks.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ChainAndCircleContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2CircleContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2Contact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ContactSolver.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2PolygonContact.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2DistanceJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2FrictionJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2GearJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2Joint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2MouseJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2PrismaticJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2PulleyJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2RevoluteJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2RopeJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2WeldJoint.bc \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2WheelJoint.bc \
Box2D_v2.2.1/Box2D/Rope/b2Rope.bc

all: bench2d.asm.js

%.bc: %.cpp
	$(EMCC) -O2 -s ASM_JS=1 $< -o $@

bench2d.bc: $(OBJECTS)
	$(LLVM)/llvm-link -o $@ $(OBJECTS)

bench2d.asm.js: bench2d.bc
	$(EMCC) -O2 -s ASM_JS=1 -s TOTAL_MEMORY=$(HEAP) $< -o $@

clean:
	rm bench2d.asm.js $(OBJECTS)
