package j15r.bench2d;

import java.util.Date;
import java.util.Arrays;

import org.jbox2d.collision.shapes.PolygonShape;
import org.jbox2d.common.Vec2;
import org.jbox2d.dynamics.Body;
import org.jbox2d.dynamics.BodyDef;
import org.jbox2d.dynamics.BodyType;
import org.jbox2d.dynamics.World;

public class Bench2d {
  static final boolean DEBUG = false;

  static final int FRAMES = 256;
  static final int PYRAMID_SIZE = 40;

  public static void main(String[] args) {
    Bench2d bench = new Bench2d();
    bench.warmup();
    bench.bench();
  }

	World world;
  Body groundBody;

  public float mean(float[] values) {
    float total = 0;
    for (int i = 0; i < FRAMES; ++i) {
      total += values[i];
    }
    return total / FRAMES;
  }

  // Simple nearest-rank %ile (on sorted array). We should have enough samples to make this reasonable.
  public float percentile(float[] values, float pc) {
    int rank = (int)((pc * values.length) / 100);
    return values[rank];
  }

  public void bench() {
    float[] times = new float[FRAMES];
    for (int i = 0; i < FRAMES; ++i) {
      long begin = new Date().getTime();
      step();
      long end = new Date().getTime();
      times[i] = (float)(end - begin);
      log("" + times[i]);
    }

    Arrays.sort(times);
    float mean = mean(times);
    System.out.println("Benchmark complete.\nms/frame: " + mean + " 5th %ile: " + percentile(times, 5) + " 95th %ile: " + percentile(times, 95));
  }

  void warmup() {
    for (int i = 0; i < FRAMES; ++i) {
      step();
    }
  }

  Bench2d() {
		Vec2 gravity = new Vec2(0, -10f);
		world = new World(gravity, true);

		{
			BodyDef bd = new BodyDef();
			Body ground = world.createBody(bd);

			PolygonShape shape = new PolygonShape();
			shape.setAsEdge(new Vec2(-40.0f, 0f), new Vec2(40.0f, 0f));
			ground.createFixture(shape, 0.0f);
		}

		{
			float a = .5f;
			PolygonShape shape = new PolygonShape();
			shape.setAsBox(a, a);

			Vec2 x = new Vec2(-7.0f, 0.75f);
			Vec2 y = new Vec2();
			Vec2 deltaX = new Vec2(0.5625f, 1f);
			Vec2 deltaY = new Vec2(1.125f, 0.0f);

			for (int i = 0; i < PYRAMID_SIZE; ++i){
				y.set(x);

				for (int j = i; j < PYRAMID_SIZE; ++j){
					BodyDef bd = new BodyDef();
					bd.type = BodyType.DYNAMIC;
					bd.position.set(y);
					Body body = world.createBody(bd);
					body.createFixture(shape, 5.0f);
					y.addLocal(deltaY);
				}

				x.addLocal(deltaX);
			}
		}
  }

	void step() {
		float timeStep = 1f / 60f;
		world.step(timeStep, 3, 3);
	}

	void log(String msg) {
    if (DEBUG) {
      System.out.println(msg);
    }
	}
}
