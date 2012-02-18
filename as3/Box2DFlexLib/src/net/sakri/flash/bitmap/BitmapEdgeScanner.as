package net.sakri.flash.bitmap{
	
	import flash.display.BitmapData;
	import flash.geom.Point;
	/**
	 * Assumes there are no "edge pixels", to use this class
	 * an extra transparent "padding" of transparent pixels
	 * should be added to the target bitmapData...
	 */
	public class BitmapEdgeScanner{
		
		//import flash.display.BitmapData;
		
		protected var _scan_points:Vector.<Point>=Vector.<Point>([
																new Point(-1,-1),
																new Point(0,-1),
																new Point(1,-1),
																new Point(-1,0),
																new Point(0,0),
																new Point(1,0),
																new Point(-1,1),
																new Point(0,1),
																new Point(1,1)
																	]);
		
		//based on all possibilities scanning clockwise on a + shape... see diagram
		//duplicate, and make "clock direction" a parameter?!
		/*
		//ORIGINAL
		protected var _variations:Object={
										"000011011":new Point(1,0),//a
										"000111111":new Point(1,0),//b
										"001111111":new Point(1,0),//c
										"011111111":new Point(0,-1),//d
										"011011111":new Point(0,-1),//e
										"011011011":new Point(0,-1),//f
										"000011011":new Point(1,0),//g
										"000110110":new Point(0,1),//h
										"110110110":new Point(0,1),//i
										"110110111":new Point(0,1),//j
										"110111111":new Point(0,1),//k
										"100111111":new Point(0,1),//l
										"110110000":new Point(-1,0),//m
										"111111000":new Point(-1,0),//n
										"111111100":new Point(-1,0),//o
										"111111110":new Point(0,1),//p
										"111110110":new Point(0,1),//q
										"011011000":new Point(0,-1),//r
										"111011011":new Point(0,-1),//s
										"111111011":new Point(-1,0),//t
										"111111001":new Point(-1,0)//u
											}
		*/
		/*
		protected var _variations:Object={
								"011011011":new Point(0,-1),
								"110110000":new Point(-1,0),
								"110110010":new Point(0,1),
								"000111111":new Point(1,0),
								"010011011":new Point(0,-1),
								"111111110":new Point(0,1),
								"101111111":new Point(1,-1),
								"011011111":new Point(0,-1),
								"111011001":new Point(-1,-1),
								"000110100":new Point(-1,1),
								"000011001":new Point(1,0),
								"000010110":new Point(0,1),
								"110111111":new Point(1,0),
								"000010011":new Point(1,1),
								"001011111":new Point(1,-1),
								"100110100":new Point(-1,1),
								"001011000":new Point(1,-1),
								"110111000":new Point(-1,0),
								"011111111":new Point(0,-1),
								"000111110":new Point(1,0),
								"111110100":new Point(-1,1),
								"110010000":new Point(-1,-1),
								"111110110":new Point(0,1),
								"110110111":new Point(0,1),
								"000010111":new Point(1,1),
								"111010000":new Point(-1,-1),
								"100111111":new Point(1,0),
								"111111011":new Point(-1,0),
								"011111000":new Point(-1,0),
								"110110110":new Point(0,1),
								"100110111":new Point(1,1),
								"010110110":new Point(0,1),
								"111111000":new Point(-1,0),
								"111111001":new Point(-1,0),
								"011010000":new Point(0,-1),
								"001011001":new Point(1,-1),
								"111011111":new Point(-1,-1),
								"100110000":new Point(-1,0),
								"001111111":new Point(1,-1),
								"000111011":new Point(1,0),
								"111011011":new Point(0,-1),
								"011011000":new Point(0,-1),
								"000110110":new Point(0,1),
								"000011011":new Point(1,0),
								"111110111":new Point(1,1),
								"011011010":new Point(0,-1),
								"111111100":new Point(-1,0),
								"111111101":new Point(-1,1)
								}*/

//								"000100100":new Point(1,0),
//
//protected var _variations:Object={
//								"000110110":new Point(0,1),
//								"111110000":new Point(-1,0),
//								"111011011":new Point(0,-1),
//								"111111110":new Point(0,1),
//								"100111111":new Point(1,0),
//								"011011011":new Point(0,-1),
//								"011011000":new Point(0,-1),
//								"110111111":new Point(1,0),
//								"011011111":new Point(0,-1),
//								"000111111":new Point(1,0),
//								"110110100":new Point(-1,0),
//								"111111000":new Point(-1,0),
//								"111111001":new Point(-1,0),
//								"111110100":new Point(-1,0),
//								"100110110":new Point(0,1),
//								"100110111":new Point(0,1),
//								"000110111":new Point(0,1),
//								"011111111":new Point(0,-1),
//								"000011011":new Point(1,0),
//								"110110110":new Point(0,1),
//								"110110111":new Point(0,1),
//								"011011001":new Point(0,-1),
//								"111011000":new Point(0,-1),
//								"111111011":new Point(-1,0),
//								"000011111":new Point(1,0),
//								"111110110":new Point(0,1),
//								"110110000":new Point(-1,0),
//								"001011111":new Point(1,0),
//								"001111111":new Point(1,0),
//								"111011001":new Point(0,-1),
//								"001011011":new Point(1,0),
//								"111111100":new Point(-1,0),
//								
//								"001110110":new Point(0,1),
//								"110110001":new Point(-1,0),
//								"100011011":new Point(1,0),
//								"011011100":new Point(0,-1)
//								
//								}
		
		
		protected var _variations:Object={
			"000110110":new Point(0,1),
			"111110000":new Point(-1,0),
			"111011011":new Point(0,-1),
			"111111110":new Point(0,1),
			"100111111":new Point(1,0),
			"011011011":new Point(0,-1),
			"101111111":new Point(1,-1),
			"011011000":new Point(0,-1),
			"110111111":new Point(1,0),
			"011011111":new Point(0,-1),
			"000111111":new Point(1,0),
			"110110100":new Point(-1,0),
			"111111000":new Point(-1,0),
			"111111001":new Point(-1,0),
			"111110100":new Point(-1,0),
			"100110110":new Point(0,1),
			"100110111":new Point(0,1),
			"000110111":new Point(0,1),
			"011111111":new Point(0,-1),
			"000011011":new Point(1,0),
			"110110110":new Point(0,1),
			"110110111":new Point(0,1),
			"011011001":new Point(0,-1),
			"111011000":new Point(0,-1),
			"111111011":new Point(-1,0),
			"000011111":new Point(1,0),
			"111110110":new Point(0,1),
			"110110000":new Point(-1,0),
			"001011111":new Point(1,0),
			"001111111":new Point(1,0),
			"111011001":new Point(0,-1),
			"001011011":new Point(1,0),
			"111111100":new Point(-1,0),
			
			"001110110":new Point(0,1),
			"110110001":new Point(-1,0),
			"100011011":new Point(1,0),
			"011011100":new Point(0,-1),
			"110111110":new Point(0,1),
			"011111011":new Point(0,-1),
			"000010011":new Point(1,1),
			"000001001":new Point(1,0),
			"010011011":new Point(0,-1),
			"111111010":new Point(0,1),
			"111010000":new Point(-1,-1),
			"111111101":new Point(-1,1)
			
		}
		
				
		protected var _target:BitmapData;
		protected var _grid:String;
		public function getCurrentGrid():String{
			return _grid+"";
		}
		
		protected var _position:Point;
		public function get position():Point{
			return _position;
		}
		
		public function BitmapEdgeScanner(target:BitmapData){
			reset(target);
		}
		
		public function reset(target:BitmapData):void{
			_grid="";
			_target=target;
		}
		
		public function moveTo(p:Point):void{
			_position=p;
			updateScanGrid();
		}
		
		protected function updateScanGrid():void{
			_grid="";
			var p:Point;
			for(var i:uint=0;i<9;i++){
				p=_scan_points[i];
				_grid+=(_target.getPixel32(_position.x+p.x,_position.y+p.y)>0x0 ? "1" : "0");
			}
		}
		
		public function getNextEdgePoint():Point{
			var p:Point=_variations[_grid];
			if(p==null)throw new Error("BitmapEdgeScanner Error : _grid:"+_grid+" , not found in _variations");
			return new Point(_position.x+p.x,_position.y+p.y);
		}
		

	}
}