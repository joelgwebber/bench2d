PROJECT=bench2d
NACL_SDK_ROOT=/opt/nacl_sdk/pepper_26
LDFLAGS := -lppapi_cpp -lppapi
# OPTS := -g -O0
OPTS := -O3
WARNINGS := -Wno-long-long -Wswitch-enum -pedantic
CXXFLAGS := -pthread -std=gnu++98 -IBox2D_v2.2.1 -I$(NACL_SDK_ROOT)/include $(WARNINGS) $(OPTS)

OSNAME := $(shell python $(NACL_SDK_ROOT)/tools/getos.py)
TC_PATH := $(abspath $(NACL_SDK_ROOT)/toolchain/$(OSNAME)_x86_newlib)
CXX := $(TC_PATH)/bin/i686-nacl-g++

CXX_SOURCES = \
bench2d_nacl.cpp \
Bench2d.cpp \
Box2D_v2.2.1/Box2D/Collision/b2BroadPhase.cpp \
Box2D_v2.2.1/Box2D/Collision/b2CollideCircle.cpp \
Box2D_v2.2.1/Box2D/Collision/b2CollideEdge.cpp \
Box2D_v2.2.1/Box2D/Collision/b2CollidePolygon.cpp \
Box2D_v2.2.1/Box2D/Collision/b2Collision.cpp \
Box2D_v2.2.1/Box2D/Collision/b2Distance.cpp \
Box2D_v2.2.1/Box2D/Collision/b2DynamicTree.cpp \
Box2D_v2.2.1/Box2D/Collision/b2TimeOfImpact.cpp \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2ChainShape.cpp \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2CircleShape.cpp \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2EdgeShape.cpp \
Box2D_v2.2.1/Box2D/Collision/Shapes/b2PolygonShape.cpp \
Box2D_v2.2.1/Box2D/Common/b2BlockAllocator.cpp \
Box2D_v2.2.1/Box2D/Common/b2Draw.cpp \
Box2D_v2.2.1/Box2D/Common/b2Math.cpp \
Box2D_v2.2.1/Box2D/Common/b2Settings.cpp \
Box2D_v2.2.1/Box2D/Common/b2StackAllocator.cpp \
Box2D_v2.2.1/Box2D/Common/b2Timer.cpp \
Box2D_v2.2.1/Box2D/Dynamics/b2Body.cpp \
Box2D_v2.2.1/Box2D/Dynamics/b2ContactManager.cpp \
Box2D_v2.2.1/Box2D/Dynamics/b2Fixture.cpp \
Box2D_v2.2.1/Box2D/Dynamics/b2Island.cpp \
Box2D_v2.2.1/Box2D/Dynamics/b2World.cpp \
Box2D_v2.2.1/Box2D/Dynamics/b2WorldCallbacks.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ChainAndCircleContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2CircleContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2Contact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ContactSolver.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2PolygonContact.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2DistanceJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2FrictionJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2GearJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2Joint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2MouseJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2PrismaticJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2PulleyJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2RevoluteJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2RopeJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2WeldJoint.cpp \
Box2D_v2.2.1/Box2D/Dynamics/Joints/b2WheelJoint.cpp \
Box2D_v2.2.1/Box2D/Rope/b2Rope.cpp

all: $(PROJECT)_x86_32.nexe $(PROJECT)_x86_64.nexe

# Define 32 bit compile and link rules for main application
x86_32_OBJS := $(patsubst %.cpp,%_32.o,$(CXX_SOURCES))
$(x86_32_OBJS) : %_32.o : %.cpp $(THIS_MAKE)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS)

$(PROJECT)_x86_32.nexe : $(x86_32_OBJS)
	$(CXX) -o $@ $^ -m32 $(CXXFLAGS) $(LDFLAGS)

# Define 64 bit compile and link rules for C++ sources
x86_64_OBJS := $(patsubst %.cpp,%_64.o,$(CXX_SOURCES))
$(x86_64_OBJS) : %_64.o : %.cpp $(THIS_MAKE)
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS)

$(PROJECT)_x86_64.nexe : $(x86_64_OBJS)
	$(CXX) -o $@ $^ -m64 $(CXXFLAGS) $(LDFLAGS)

