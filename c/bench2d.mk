CC = gcc
CFLAGS = -g -O3 -IBox2D_v2.2.1 -DNDEBUG=1
LFLAGS = -lstdc++

OBJECTS = Bench2d.o \
Box2D_v2.2.1/Box2d/Collision/b2BroadPhase.o \
Box2D_v2.2.1/Box2d/Collision/b2CollideCircle.o \
Box2D_v2.2.1/Box2d/Collision/b2CollideEdge.o \
Box2D_v2.2.1/Box2d/Collision/b2CollidePolygon.o \
Box2D_v2.2.1/Box2d/Collision/b2Collision.o \
Box2D_v2.2.1/Box2d/Collision/b2Distance.o \
Box2D_v2.2.1/Box2d/Collision/b2DynamicTree.o \
Box2D_v2.2.1/Box2d/Collision/b2TimeOfImpact.o \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2ChainShape.o \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2CircleShape.o \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2EdgeShape.o \
Box2D_v2.2.1/Box2d/Collision/Shapes/b2PolygonShape.o \
Box2D_v2.2.1/Box2d/Common/b2BlockAllocator.o \
Box2D_v2.2.1/Box2d/Common/b2Draw.o \
Box2D_v2.2.1/Box2d/Common/b2Math.o \
Box2D_v2.2.1/Box2d/Common/b2Settings.o \
Box2D_v2.2.1/Box2d/Common/b2StackAllocator.o \
Box2D_v2.2.1/Box2d/Common/b2Timer.o \
Box2D_v2.2.1/Box2d/Dynamics/b2Body.o \
Box2D_v2.2.1/Box2d/Dynamics/b2ContactManager.o \
Box2D_v2.2.1/Box2d/Dynamics/b2Fixture.o \
Box2D_v2.2.1/Box2d/Dynamics/b2Island.o \
Box2D_v2.2.1/Box2d/Dynamics/b2World.o \
Box2D_v2.2.1/Box2d/Dynamics/b2WorldCallbacks.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndCircleContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ChainAndPolygonContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2CircleContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2Contact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2ContactSolver.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndCircleContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2EdgeAndPolygonContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonAndCircleContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Contacts/b2PolygonContact.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2DistanceJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2FrictionJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2GearJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2Joint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2MouseJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PrismaticJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2PulleyJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RevoluteJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2RopeJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WeldJoint.o \
Box2D_v2.2.1/Box2d/Dynamics/Joints/b2WheelJoint.o \
Box2D_v2.2.1/Box2d/Rope/b2Rope.o

all: bench2d

%.o: %.cpp
	$(CC) $(CFLAGS) -o $@ -c $<

bench2d: $(OBJECTS)
	$(CC) $(LFLAGS) -o $@ $(OBJECTS)

clean:
	rm $(OBJECTS)

