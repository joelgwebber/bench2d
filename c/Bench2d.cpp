#include <Box2D/Box2D.h>

#include <cstdio>
#include <time.h>

using namespace std;

#if 1
#define WARMUP 0
#define FRAMES 256

const int e_count = 2;

void bench() {
	// Define the gravity vector.
	b2Vec2 gravity(0.0f, -10.0f);

	// Construct a world object, which will hold and simulate the rigid bodies.
	b2World world(gravity);
  world.SetAllowSleeping(false);

	{
		b2BodyDef bd;
		b2Body* ground = world.CreateBody(&bd);

		b2EdgeShape shape;
		shape.Set(b2Vec2(-40.0f, 0.0f), b2Vec2(40.0f, 0.0f));
		ground->CreateFixture(&shape, 0.0f);
	}

b2Body* topBody;

	{
		float32 a = 0.5f;
		b2PolygonShape shape;
		shape.SetAsBox(a, a);

		b2Vec2 x(-7.0f, 0.75f);
		b2Vec2 y;
		b2Vec2 deltaX(0.5625f, 1);
		b2Vec2 deltaY(1.125f, 0.0f);

		for (int32 i = 0; i < e_count; ++i) {
			y = x;

			for (int32 j = i; j < e_count; ++j) {
				b2BodyDef bd;
				bd.type = b2_dynamicBody;
				bd.position = y;
				b2Body* body = world.CreateBody(&bd);
				body->CreateFixture(&shape, 5.0f);

topBody = body;

				y += deltaY;
			}

			x += deltaX;
		}
	}

	for (int32 i = 0; i < WARMUP; ++i) {
		world.Step(1.0f/60.0f, 3, 3);
  }

	clock_t times[FRAMES]; 
	for (int32 i = 0; i < FRAMES; ++i) {
		clock_t start = clock();
		world.Step(1.0f/60.0f, 3, 3);
		clock_t end = clock();
		times[i] = end - start;
printf("%f :: ", topBody->GetPosition().y);
		printf("%f\n", (float32)(end - start) / CLOCKS_PER_SEC * 1000);
	}

	printf("\n");

	clock_t total = 0;
	for (int32 i = 0; i < FRAMES; ++i) {
		total += times[i];
	}
	printf("%f\n", (float32)total / FRAMES / CLOCKS_PER_SEC * 1000);
}

int main(int argc, char** argv) {
  bench();
  return 0;
}

#else

int main(int argc, char** argv)
{
	B2_NOT_USED(argc);
	B2_NOT_USED(argv);

	// Define the gravity vector.
	b2Vec2 gravity(0.0f, -10.0f);

	// Construct a world object, which will hold and simulate the rigid bodies.
	b2World world(gravity);

	// Define the ground body.
	b2BodyDef groundBodyDef;
	groundBodyDef.position.Set(0.0f, -10.0f);

	// Call the body factory which allocates memory for the ground body
	// from a pool and creates the ground box shape (also from a pool).
	// The body is also added to the world.
	b2Body* groundBody = world.CreateBody(&groundBodyDef);

	// Define the ground box shape.
	b2PolygonShape groundBox;

	// The extents are the half-widths of the box.
	groundBox.SetAsBox(50.0f, 10.0f);

	// Add the ground fixture to the ground body.
	groundBody->CreateFixture(&groundBox, 0.0f);

	// Define the dynamic body. We set its position and call the body factory.
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(0.0f, 4.0f);
	b2Body* body = world.CreateBody(&bodyDef);

	// Define another box shape for our dynamic body.
	b2PolygonShape dynamicBox;
	dynamicBox.SetAsBox(1.0f, 1.0f);

	// Define the dynamic body fixture.
	b2FixtureDef fixtureDef;
	fixtureDef.shape = &dynamicBox;

	// Set the box density to be non-zero, so it will be dynamic.
	fixtureDef.density = 1.0f;

	// Override the default friction.
	fixtureDef.friction = 0.3f;

	// Add the shape to the body.
	body->CreateFixture(&fixtureDef);

	// Prepare for simulation. Typically we use a time step of 1/60 of a
	// second (60Hz) and 10 iterations. This provides a high quality simulation
	// in most game scenarios.
	float32 timeStep = 1.0f / 60.0f;
	int32 velocityIterations = 6;
	int32 positionIterations = 2;

	// This is our little game loop.
	for (int32 i = 0; i < 60; ++i)
	{
		// Instruct the world to perform a single step of simulation.
		// It is generally best to keep the time step and iterations fixed.
		world.Step(timeStep, velocityIterations, positionIterations);

		// Now print the position and angle of the body.
		b2Vec2 position = body->GetPosition();
		float32 angle = body->GetAngle();

		printf("%4.2f %4.2f %4.2f\n", position.x, position.y, angle);
	}

	// When the world destructor is called, all bodies and joints are freed. This can
	// create orphaned pointers, so be careful about your world management.

	return 0;
}
#endif

