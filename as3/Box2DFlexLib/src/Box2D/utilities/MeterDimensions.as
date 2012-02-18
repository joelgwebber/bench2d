package Box2D.utilities
{
	public class MeterDimensions
	{
		public function MeterDimensions(worldDef:WorldDefinition,pixelWidth:Number=0,pixelHeight:Number=0,pixelLeft:Number=0,pixelTop:Number=0)
		{
			_width = worldDef.meter(pixelWidth);
			_height = worldDef.meter(pixelHeight);
			_x = worldDef.meter(pixelLeft);
			_y = worldDef.meter(pixelTop);
		}
		
		protected var _width:Number;
		public function get width():Number
		{
			return _width;
		}
		
		protected var _height:Number;
		public function get height():Number
		{
			return _height;
		}
		
		protected var _x:Number;
		public function get x():Number
		{
			return _x;
		}
		
		protected var _y:Number;
		public function get y():Number
		{
			return _y;
		}
		
		
		
		
	}
}