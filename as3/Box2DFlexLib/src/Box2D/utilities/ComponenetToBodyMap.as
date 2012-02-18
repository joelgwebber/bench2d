package Box2D.utilities
{
	import Box2D.Collision.Shapes.b2Shape;
	import Box2D.Collision.b2AABB;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2BodyDef;
	import Box2D.Dynamics.b2FixtureDef;

	public class ComponenetToBodyMap
	{
		static public const STATIC_BODY:uint = 0;//b2Body.b2_staticBody;
		static public const KINEMATIC_BODY:uint = 1;//b2Body.b2_kinematicBody;
		static public const DYNAMIC_BODY:uint = 2;//b2Body.b2_dynamicBody;
		
		public function ComponenetToBodyMap(shapes:Array,fixtureDef:b2FixtureDef=null,bodyType:uint=DYNAMIC_BODY)
		{
			this.shapes = shapes;
			this.fixtureDef = fixtureDef;
			this.bodyType=bodyType;
		}
		
		protected var _fixtureDef:b2FixtureDef;
		public function get fixtureDef():b2FixtureDef
		{
			return _fixtureDef;
		}
		
		public function set fixtureDef(value:b2FixtureDef):void
		{
			if (value ==_fixtureDef)
				return;
			_fixtureDef = value;
		}
		
		protected var _shapes:Array;
		public function get shapes():Array
		{
			return _shapes;
		}
		
		public function set shapes(value:Array):void
		{
			if (value ==_shapes)
				return;
			_shapes = value;
		}
		
		protected var _bodyType:uint;
		public function get bodyType():uint
		{
			return _bodyType;
		}
		
		public function set bodyType(value:uint):void
		{
			if (value ==_bodyType)
				return;
			_bodyType = value;
		}
	}
}