package Box2D.utilities
{
	public class PixelDimensions
	{
		public function PixelDimensions(worldDef:WorldDefinition,meterWidth:Number=0,meterHeight:Number=0,meterLeft:Number=0,meterTop:Number=0)
		{
			_width = worldDef.pixel(meterWidth);
			_height = worldDef.pixel(meterHeight);
			_x = worldDef.pixel(meterLeft);
			_y = worldDef.pixel(meterTop);
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