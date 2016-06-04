CC = gcc
BOX2D = Box2D_2.3.1
CFLAGS = -O3 -msse -ffast-math -fomit-frame-pointer -Wno-null-conversion -I$(BOX2D) -DNDEBUG=1
LFLAGS = -lstdc++

BOX2DSRC=$(BOX2D)/Box2D
OBJECTS = \
bench2d_main.o \
Bench2d.o \
$(BOX2DSRC)/Collision/b2BroadPhase.o \
$(BOX2DSRC)/Collision/b2CollideCircle.o \
$(BOX2DSRC)/Collision/b2CollideEdge.o \
$(BOX2DSRC)/Collision/b2CollidePolygon.o \
$(BOX2DSRC)/Collision/b2Collision.o \
$(BOX2DSRC)/Collision/b2Distance.o \
$(BOX2DSRC)/Collision/b2DynamicTree.o \
$(BOX2DSRC)/Collision/b2TimeOfImpact.o \
$(BOX2DSRC)/Collision/Shapes/b2ChainShape.o \
$(BOX2DSRC)/Collision/Shapes/b2CircleShape.o \
$(BOX2DSRC)/Collision/Shapes/b2EdgeShape.o \
$(BOX2DSRC)/Collision/Shapes/b2PolygonShape.o \
$(BOX2DSRC)/Common/b2BlockAllocator.o \
$(BOX2DSRC)/Common/b2Draw.o \
$(BOX2DSRC)/Common/b2Math.o \
$(BOX2DSRC)/Common/b2Settings.o \
$(BOX2DSRC)/Common/b2StackAllocator.o \
$(BOX2DSRC)/Common/b2Timer.o \
$(BOX2DSRC)/Dynamics/b2Body.o \
$(BOX2DSRC)/Dynamics/b2ContactManager.o \
$(BOX2DSRC)/Dynamics/b2Fixture.o \
$(BOX2DSRC)/Dynamics/b2Island.o \
$(BOX2DSRC)/Dynamics/b2World.o \
$(BOX2DSRC)/Dynamics/b2WorldCallbacks.o \
$(BOX2DSRC)/Dynamics/Contacts/b2ChainAndCircleContact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2ChainAndPolygonContact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2CircleContact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2Contact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2ContactSolver.o \
$(BOX2DSRC)/Dynamics/Contacts/b2EdgeAndCircleContact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2EdgeAndPolygonContact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2PolygonAndCircleContact.o \
$(BOX2DSRC)/Dynamics/Contacts/b2PolygonContact.o \
$(BOX2DSRC)/Dynamics/Joints/b2DistanceJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2FrictionJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2GearJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2Joint.o \
$(BOX2DSRC)/Dynamics/Joints/b2MotorJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2MouseJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2PrismaticJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2PulleyJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2RevoluteJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2RopeJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2WeldJoint.o \
$(BOX2DSRC)/Dynamics/Joints/b2WheelJoint.o \
$(BOX2DSRC)/Rope/b2Rope.o

all: bench2d

%.o: %.cpp
	$(CC) $(CFLAGS) -o $@ -c $<

bench2d: $(OBJECTS)
	$(CC) $(LFLAGS) -o $@ $(OBJECTS)

clean:
	rm $(OBJECTS)

