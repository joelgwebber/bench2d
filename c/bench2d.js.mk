EMMAKEN=/Users/jgw/src/emscripten/tools/emmaken.py -IBox2D_v2.2.1
EMSCRIPTEN=/Users/jgw/src/emscripten/emscripten.py
LLVM_LINK=/Users/jgw/llvm/bin/llvm-link
LLVM_OPT=/Users/jgw/llvm/bin/opt

# This set of flags has been chosen by the "cargo cult" method -- I picked them
# mostly from the ammo.js build file, and tweaked them until I got the best
# results. It's entirely possible I've missed something important here.
EMSCRIPTEN_FLAGS = \
#-s ASSERTIONS=0 \
#--optimize \
#-s USE_TYPED_ARRAYS=1 \
#-s RELOOP=1 \
#-s SAFE_HEAP=0 \
#-s QUANTUM_SIZE=1 \
#-s SKIP_STACK_IN_SMALL=1 \
#-s INIT_STACK=0 \
#-s PGO=0 \
#-s CHECK_OVERFLOWS=0 \
#-s CHECK_SIGNED_OVERFLOWS=0 \
#-s CORRECT_OVERFLOWS=0 \
#-s CHCK_SIGNS=0 \
#-s CORRECT_SIGNS=0 \
#-s DISABLE_EXCEPTION_CATCHING=1 \
#-s RUNTYPE_TYPE_INFO=0 \
#-s CORRECT_ROUNDINGS=0 \
#-s MICRO_OPTS=0

OBJECTS = \
Bench2d.bc \
Box2D_v2.2.1/Box2d/Collision/b2BroadPhase.bc \
Box2D_v2.2.1/Box2d/Collision/b2CollideCircle.bc \
Box2D_v2.2.1/Box2d/Collision/b2CollideEdge.bc \
Box2D_v2.2.1/Box2d/Collision/b2CollidePolygon.bc \
Box2D_v2.2.1/Box2d/Collision/b2Collision.bc \
Box2D_v2.2.1/Box2d/Collision/b2Distance.bc \
Box2D_v2.2.1/Box2d/Collision/b2DynamicTree.bc \
Box2D_v2.2.1/Box2d/Collision/b2TimeOfImpact.bc \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2ChainShape.bc \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2CircleShape.bc \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2EdgeShape.bc \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2PolygonShape.bc \
Box2D_v2.2.1/Box2d/Common/b2BlockAllocator.bc \
Box2D_v2.2.1/Box2d/Common/b2Draw.bc \
Box2D_v2.2.1/Box2d/Common/b2Math.bc \
Box2D_v2.2.1/Box2d/Common/b2Settings.bc \
Box2D_v2.2.1/Box2d/Common/b2StackAllocator.bc \
Box2D_v2.2.1/Box2d/Common/b2Timer.bc \
Box2D_v2.2.1/Box2d/Dynamics/b2Body.bc \
Box2D_v2.2.1/Box2d/Dynamics/b2ContactManager.bc \
Box2D_v2.2.1/Box2d/Dynamics/b2Fixture.bc \
Box2D_v2.2.1/Box2d/Dynamics/b2Island.bc \
Box2D_v2.2.1/Box2d/Dynamics/b2World.bc \
Box2D_v2.2.1/Box2d/Dynamics/b2WorldCallbacks.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndCircleContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndPolygonContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2CircleContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2Contact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ContactSolver.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndCircleContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndPolygonContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonAndCircleContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonContact.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2DistanceJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2FrictionJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2GearJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2Joint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2MouseJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PrismaticJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PulleyJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RevoluteJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RopeJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WeldJoint.bc \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WheelJoint.bc \
Box2D_v2.2.1/Box2d/Rope/b2Rope.bc

all: bench2d.js

%.bc: %.cpp
	python $(EMMAKEN) $< -o $@

bench2d.out.bc: $(OBJECTS)
	$(LLVM_LINK) -o $@ $(OBJECTS)

bench2d.opt.bc: bench2d.out.bc
	$(LLVM_OPT) $< -o $@

bench2d.js: bench2d.opt.bc
	$(EMSCRIPTEN) $(EMSCRIPTEN_FLAGS) $< > $@

clean:
	rm bench2d.js bench2d.out.bc bench2d.opt.bc $(OBJECTS)

