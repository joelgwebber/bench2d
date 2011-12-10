#include <Box2D/Box2D.h>

#include <cstdio>
#include <time.h>

using namespace std;

#define FRAMES 256
const int e_count = 40;

void bench() {
	// Define the gravity vector.
	b2Vec2 gravity(0.0f, -10.0f);

	// Construct a world object, which will hold and simulate the rigid bodies.
	b2World world(gravity);

	{
		b2BodyDef bd;
		b2Body* ground = world.CreateBody(&bd);

		b2EdgeShape shape;
		shape.Set(b2Vec2(-40.0f, 0.0f), b2Vec2(40.0f, 0.0f));
		ground->CreateFixture(&shape, 0.0f);
	}

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

				y += deltaY;
			}

			x += deltaX;
		}
	}

	clock_t times[FRAMES]; 
	for (int32 i = 0; i < FRAMES; ++i) {
		clock_t start = clock();
		world.Step(1.0f/60.0f, 3, 3);
		clock_t end = clock();
		times[i] = end - start;
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

