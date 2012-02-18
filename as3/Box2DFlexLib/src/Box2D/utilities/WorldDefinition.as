package Box2D.utilities
{
	import Box2D.Collision.Shapes.b2Shape;
	
	import flash.utils.Dictionary;
	
	import mx.core.UIComponent;

	public class WorldDefinition
	{
		// World
		private static const VELOCITY_ITERATIONS:int = 1;
		private static const POSITION_ITERATIONS:int = 1;
		private static const SCALE:Number = 30;
		
		// Fixture
		private static const FIXTURE_DENSITY:int = 1;
		private static const FIXTURE_FRICTION:int = 1;
		private static const FIXTURE_RESTITUTION:Number = 1;
		
		/*public static function pixel(meter:Number):Number{
			return meter * SCALE;
		}
		
		public static function meter(pixel:Number):Number{
			return pixel / SCALE;
		}*/
		
		private static var _globalDefinition:WorldDefinition;
		public static function get globalDefinition():WorldDefinition
		{
			if (_globalDefinition==null)
				_globalDefinition = new WorldDefinition();
			return _globalDefinition;
		}
		
		
		public function WorldDefinition()
		{
			velocityIterations = VELOCITY_ITERATIONS;
			positionIterations = POSITION_ITERATIONS;
			scale = SCALE;
			fixtureDensity = FIXTURE_DENSITY;
			fixtureFriction = FIXTURE_FRICTION;
			fixtureRestitution = FIXTURE_RESTITUTION;
		
		}
		
		protected var _velocityIterations:int;
		public function get velocityIterations():int
		{
			return _velocityIterations;
		}
		
		public function set velocityIterations(value:int):void
		{
			if (value ==_velocityIterations)
				return;
			_velocityIterations = value;
		}
		
		protected var _positionIterations:int;
		public function get positionIterations():int
		{
			return _positionIterations;
		}
		
		public function set positionIterations(value:int):void
		{
			if (value ==_positionIterations)
				return;
			_positionIterations = value;
		}
		
		
		protected var _timeStep:Number;
		public function get timeStep():Number
		{
			return _timeStep;
		}
		
		public function set timeStep(value:Number):void
		{
			if (value ==_timeStep)
				return;
			_timeStep = value;
		}
		
		protected var _scale:Number;
		public function get scale():Number
		{
			return _scale;
		}
		
		public function set scale(value:Number):void
		{
			if (value ==_scale)
				return;
			_scale = value;
		}
		
		protected var _fixtureRestitution:Number;
		public function get fixtureRestitution():Number
		{
			return _fixtureRestitution;
		}
		
		public function set fixtureRestitution(value:Number):void
		{
			if (value ==_fixtureRestitution)
				return;
			_fixtureRestitution = value;
		}
		
		protected var _fixtureDensity:Number;
		public function get fixtureDensity():Number
		{
			return _fixtureDensity;
		}
		
		public function set fixtureDensity(value:Number):void
		{
			if (value ==_fixtureDensity)
				return;
			_fixtureDensity = value;
		}
		
		protected var _fixtureFriction:Number;
		public function get fixtureFriction():Number
		{
			return _fixtureFriction;
		}
		
		public function set fixtureFriction(value:Number):void
		{
			if (value ==_fixtureFriction)
				return;
			_fixtureFriction = value;
		}
		
		
		public function pixel(meter:Number):Number{
			return meter * scale;
		}
		
		public function meter(pixel:Number):Number{
			return pixel / scale;
		}
		
		public function meterDimentions(pixelWidth:Number=0,pixelHeight:Number=0,pixelLeft:Number=0,pixelTop:Number=0):MeterDimensions
		{
			return new MeterDimensions(this,pixelWidth,pixelHeight,pixelLeft,pixelTop);
		}
		
		public function pixelDimentions(meterWidth:Number=0,meterHeight:Number=0,meterLeft:Number=0,meterTop:Number=0):PixelDimensions
		{
			return new PixelDimensions(this,meterWidth,meterHeight,meterLeft,meterTop);
		}
		
		public function radians(degrees:Number):Number
		{
			return degrees * (Math.PI/180);
		}
	}
}