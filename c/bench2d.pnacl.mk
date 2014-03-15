VALID_TOOLCHAINS := pnacl newlib glibc
include $(NACL_SDK_ROOT)/tools/common.mk
TARGET = bench2d
LIBS = ppapi_cpp ppapi
OPTS := -O3
WARNINGS := -Wno-long-long -Wno-switch-enum -pedantic
CFLAGS := -pthread -std=gnu++98 -IBox2D_v2.2.1 $(WARNINGS) $(OPTS)

SOURCES = \
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

$(foreach src,$(SOURCES),$(eval $(call COMPILE_RULE,$(src),$(CFLAGS))))

ifeq ($(CONFIG),Release)
$(eval $(call LINK_RULE,$(TARGET)_unstripped,$(SOURCES),$(LIBS),$(DEPS)))
$(eval $(call STRIP_RULE,$(TARGET),$(TARGET)_unstripped))
else
$(eval $(call LINK_RULE,$(TARGET),$(SOURCES),$(LIBS),$(DEPS)))
endif

$(eval $(call NMF_RULE,$(TARGET),))
