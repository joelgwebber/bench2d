package Box2D.utilities
{
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Common.Math.b2Vec2;
	
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.geom.ColorTransform;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	import mx.controls.Alert;
	import mx.core.IVisualElementContainer;
	
	import net.sakri.flash.bitmap.BitmapDataUtil;
	import net.sakri.flash.bitmap.BitmapEdgeScanner;
	import net.sakri.flash.bitmap.BitmapShapeExtractor;
	import net.sakri.flash.bitmap.ExtractedShapeCollection;
	import net.sakri.flash.vector.ShapeFidality;
	import net.sakri.flash.vector.ShapeOptimizer;
	import net.sakri.flash.vector.VectorShape;
	
	import spark.components.SkinnableContainer;

	public class ComplexShapeParser
	{
		public static const DEFAULT_MAX_VERTEX:uint=10000;//Failsafe
		public static const DEFAULT_ALPHA_LEVEL:Number = 0;
		private var element:*;
		private var container:IVisualElementContainer;
		private var worldDef:WorldDefinition;
		protected var shapeCollection:ExtractedShapeCollection;
		protected var siluate:BitmapData;
		
		public function ComplexShapeParser(fidality:uint = ShapeFidality.MEDIUM,alpha:Number = DEFAULT_ALPHA_LEVEL,maxVertex:uint=DEFAULT_MAX_VERTEX)
		{
			this.shapeFidality = fidality;
			this.alphaLevel = alpha;
			this.maxVertex = maxVertex;
			_b2dshapes = new Array();
		}
		
		public function parse(element:*,containr:IVisualElementContainer,worldDef:WorldDefinition):Array
		{
			this.element = element;
			this.container = container;
			this.worldDef = worldDef;
			createSiluate();
			parseSiluate();
			extractShapes();
			return _b2dshapes;
		}
		
		protected function createSiluate():BitmapData
		{
			
//			one way is to use bounding rect but it should be after createion complete
//			var ct:ColorTransform = new ColorTransform(1,1,1,1,255,255,255,alphaLevel);
//			var rect:Rectangle = element.getBounds(container);
//			var bmd:BitmapData=new BitmapData(rect.width,rect.height,true,0x00);
//			bmd.draw(element,null,ct,null,rect);
//			return bmd;
//			the other alternative is using elelment.width & height 	
			var ct:ColorTransform = new ColorTransform(1,1,1,1,255,255,255,alphaLevel);
			var bmd:BitmapData=new BitmapData(element.width,element.height,true,0x00);
			bmd.draw(element,null,ct);
			return bmd;
		}
		
		protected function parseSiluate():void
		{
			siluate = createSiluate();
			shapeCollection=BitmapShapeExtractor.extractShapesDoubleSize(siluate);
//			 the other alternative is to pass the bitmap data through another color transform via toMonoChrome2 i found it less accurate
//			shapes=BitmapShapeExtractor.extractShapesDoubleSize(BitmapDataUtil.toMonoChrome2(siluate));
			
		}
		
		protected function extractShapes():void
		{
			var pixels:Vector.<Point>;
			var vs:VectorShape;
			var shapeOutline:Array;
			for(var i:int=0;i<shapeCollection.shapes.length;i++){
				pixels=getEdgePointsFromBitmapData(shapeCollection.shapes[i]);//<-- the magic happens here
				if (shapeFidality==ShapeFidality.HIGH)
				{
					shapeOutline = VectorToArray(pixels);
				}
				else
				{
					vs=ShapeOptimizer.getOptimizedVectorShapeFromPoints(pixels,shapeFidality);
					shapeOutline = VectorToArray(vs.getPointsVector());
				}	
				
				var shapeFromPolygons:Polygon2D = new Polygon2D(shapeOutline);
				convertTob2PolygonShapeCollection(shapeFromPolygons);
			}
		}

		private function convertTob2PolygonShapeCollection(shapeFromPolygons:Polygon2D):void
		{
			var triangles:Array = shapeFromPolygons.triangles();
			for (var j:int = 0; j < triangles.length; j++) 
			{
				var poly:Polygon2D = triangles[j] as Polygon2D;
				var shape:b2PolygonShape = convertTob2PolygonShape(poly);
				_b2dshapes.push(shape);	
			}
		}

		private function convertTob2PolygonShape(poly:Polygon2D):b2PolygonShape
		{
			var shape:b2PolygonShape = new b2PolygonShape();
			var vertices:Vector.<b2Vec2> = new Vector.<b2Vec2>();
			for (var k:int = 0; k < poly.vertices.length; k++) 
			{
				var point:Point = poly.vertices[k] as Point;
				vertices.push(new b2Vec2(worldDef.meter(point.x),worldDef.meter(point.y)));
		
			}
			shape.SetAsVector(vertices,3);
			return shape;
		}

		protected function VectorToArray( v:Object ):Array
		{
			var vec : Vector.<Object> = Vector.<Object>(v);
			var arr : Array = new Array()
			for each( var i : Object in vec ) {
				arr.push(i);
			}
			return arr;
		}
		
		protected function getEdgePointsFromBitmapData(bmd:BitmapData):Vector.<Point>{
			var first_non_trans:Point=BitmapDataUtil.getFirstNonTransparentPixel(bmd);
			var points:Vector.<Point>=new Vector.<Point>();
			if(first_non_trans==null)return points;
			var scanner:BitmapEdgeScanner=new BitmapEdgeScanner(bmd);
			scanner.moveTo(first_non_trans);
			points[0]=first_non_trans;
			var next:Point;
			//in the event of a bug (an error, infinite loop) in BitEdgeScanner, which is not perfect,
			//this loop stops at MAX_POINTS. Increase this number if working with big bitmapdatas. 
			for(var i:uint=0;i<DEFAULT_MAX_VERTEX;i++){
				next=scanner.getNextEdgePoint();
				if(next.equals(first_non_trans))break;
				points.push(next);
				scanner.moveTo(next);
			}
			//if(i>=MAX_POINTS)mx.controls.Alert.show("Error : shape scan has more than MAX_POINTS ("+MAX_POINTS+")");
			return points;
		}
		
		
		protected var _shapeFidality:uint = ShapeFidality.MEDIUM; 
		public function get shapeFidality():uint
		{
			return _shapeFidality;
		}
		
		public function set shapeFidality(value:uint):void
		{
			if (value ==_shapeFidality)
				return;
			_shapeFidality = value;
		}
		
		protected var _b2dshapes:Array;
		public function get b2dshapes():Array
		{
			return _b2dshapes;
		}
		
		protected var _maxVertex:uint = DEFAULT_MAX_VERTEX;
		public function get maxVertex():uint
		{
			return _maxVertex;
		}
		
		public function set maxVertex(value:uint):void
		{
			if (value ==_maxVertex)
				return;
			_maxVertex = value;
		}
		
		
		protected var _alphaLevel:Number = DEFAULT_ALPHA_LEVEL;
		public function get alphaLevel():Number
		{
			return _alphaLevel;
		}
		
		public function set alphaLevel(value:Number):void
		{
			var minRange:Number= -255;
			var maxRange:Number = 255;
			if (value<minRange || value>maxRange)
				throw new Error("Alpha Level must be between -255 and 255");
			if (value ==_alphaLevel)
				return;
			_alphaLevel = value;
		}
		
	}
}