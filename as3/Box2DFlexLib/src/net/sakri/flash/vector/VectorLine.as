package net.sakri.flash.vector{
	import flash.geom.Point;
	
	/**
	 * vertical and horizontal lines only
	 * minimum length of 1 (adjacent pixels)
	 */
	public class VectorLine{
		
		public static const HORIZONTAL:uint=0;
		public static const VERTICAL:uint=1;
		public static const DIAGONAL:uint=2;
		public static const TEST:uint=3;
		
		public static const RIGHT:uint=0;
		public static const DOWN:uint=1;
		public static const UP:uint=2;
		public static const LEFT:uint=3;

		protected var _start:Point;
		public function get start_point():Point{
			return _start;
		}
		public function set start_point(p:Point):void{
			_start=p;
		}
		protected var _end:Point;
		public function get end_point():Point{
			return _end;
		}
		public function set end_point(p:Point):void{
			_end=p;
		}
		protected var _type:uint;
		public function get type():uint{
			return _type;
		}
		public function set type(t:uint):void{
			_type=t;
		}
		
		protected var _direction:uint;
		public function get direction():uint{
			return _direction;
		}
				
		public function VectorLine(p1:Point, p2:Point, type:uint, line_direction:uint=0){
			super();
			_start=p1;
			_end=p2;
			_type=type;
			_direction=line_direction;
		}
		
		protected var _length:Number;
		public function get length():Number{
			if(!isNaN(_length))return _length;
			_length=Point.distance(_start,_end);
			return _length;
		}
		
		public function toString():String{
			return "VectorLine{\n\type:"+_type+",\n\tstart:"+_start+",\n\tend:"+_end+",\n\tlength:"+length+"\n}"
		}
		
	}
}