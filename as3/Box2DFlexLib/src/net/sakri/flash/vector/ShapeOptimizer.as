package net.sakri.flash.vector{
	import flash.geom.Point;
	
	public class ShapeOptimizer{
	
		public static function getOptimizedVectorShapeFromPoints(points:Vector.<Point>,shapeFidality:uint=ShapeFidality.MEDIUM):VectorShape{
			var vs:VectorShape=createVectorShape(points);
			if (shapeFidality  == ShapeFidality.LOW){
				setBreakPoints(vs);
				vs.optimizeUsingBreakPoints();
			}
			return vs;
		}
		
		protected static function setBreakPoints(vs:VectorShape):void{
			var break_points:Object=new Object();
			addBreakPoints(break_points,vs);
			addBreakPointsReverse(break_points,vs);
			vs.break_points=getVectorFromBreakPointsObject(break_points);
		}
		
		public static function createVectorShape(points:Vector.<Point>):VectorShape{
			points=pruneRedundantPoints(points);
			return createVectorShapeFromPrunedPoints(points);
		}
		
		private static function createVectorShapeFromPrunedPoints(points:Vector.<Point>):VectorShape{
			//checkDuplicates(points);
			var prev:Point=points[0];
			var cur:Point;
			var lines:Vector.<VectorLine>=new Vector.<VectorLine>();
			var line:VectorLine;
			var total:uint;
			for(var i:uint=1;i<points.length;i++){
				cur=points[i];
				if(prev.x==cur.x){
					line=new VectorLine(prev,cur,VectorLine.VERTICAL,(cur.y>prev.y ? VectorLine.DOWN : VectorLine.UP));
				}else{
					line=new VectorLine(prev,cur,VectorLine.HORIZONTAL,(cur.x>prev.x ? VectorLine.RIGHT : VectorLine.LEFT));
				}
				lines.push(line);
				prev=cur;
			}
			//add final connection
			cur=points[0];
			if(prev.x==cur.x){
				line=new VectorLine(prev,cur,VectorLine.VERTICAL,(cur.y>prev.y ? VectorLine.DOWN : VectorLine.UP));
			}else{
				line=new VectorLine(prev,cur,VectorLine.HORIZONTAL,(cur.x>prev.x ? VectorLine.RIGHT : VectorLine.LEFT));
			}
			lines.push(line);
			var vs:VectorShape=new VectorShape();
			vs.lines=lines;
			return vs;
		}
		
		public static function pruneRedundantPoints(points:Vector.<Point>):Vector.<Point>{
			
			var prev:Point=points[0];
			var cur:Point;
			var pruned:Vector.<Point>=new Vector.<Point>();
			pruned[0]=points[0];
			var direction:uint=VectorLine.HORIZONTAL;
			for(var i:uint=1;i<points.length;i++){
				cur=points[i];
				if(direction==VectorLine.HORIZONTAL){
					if(cur.y!=prev.y){	
						pruned.push(prev);
						
						direction=VectorLine.VERTICAL;
					}
				}else{
					if(cur.x!=prev.x){
						pruned.push(prev);
						direction=VectorLine.HORIZONTAL;
					}				
				}
				prev=cur;
			}
			return pruned;
		}
		
		protected static function getVectorFromBreakPointsObject(bp:Object):Vector.<Point>{
			var points:Vector.<Point>=new Vector.<Point>;
			var p:Point;
			var parts:Array;
			for(var i:String in bp){
				parts=i.split("-");
				points.push(new Point(uint(parts[0]),uint(parts[1])));
			}
			return points;
		}
		
		protected static function getVectorShapeLinesWithBoundary(vs:VectorShape,boundary:uint=5):Vector.<VectorLine>{
			var lines:Vector.<VectorLine>=vs.lines.slice(vs.lines.length-boundary,vs.lines.length);
			return lines.concat(vs.lines.slice(0,boundary),vs.lines);
		}
		
		protected static function addBreakPoints(points:Object,vs:VectorShape):void{
			var lines:Vector.<VectorLine>=getVectorShapeLinesWithBoundary(vs,4);
			var prev_horizontal:VectorLine;
			var prev_vertical:VectorLine;
			var line:VectorLine;
			var point_string:String;
			var register_break_point:Boolean=false;
			var i:uint;
			for(i=0;i<lines.length;i++){
				line=lines[i];
				if(prev_horizontal==null || prev_vertical==null){
					if(line.type==VectorLine.HORIZONTAL){
						prev_horizontal=line;
					}else{
						prev_vertical=line;
					}
				}else{break;}
			}
			
			for(i=i+1;i<lines.length;i++){
				line=lines[i];
				if(line.type==VectorLine.HORIZONTAL){
					if(line.direction!=prev_horizontal.direction)register_break_point=true;
					prev_horizontal=line;
				}else{
					if(line.direction!=prev_vertical.direction)register_break_point=true;
					prev_vertical=line;
				}
				if(register_break_point){
					point_string=line.start_point.x+"-"+line.start_point.y;
					if(points[point_string]==null)points[point_string]=1;
					register_break_point=false;
				}
			}
		}
		protected static function addBreakPointsReverse(points:Object,vs:VectorShape):void{
			var lines:Vector.<VectorLine>=getVectorShapeLinesWithBoundary(vs,4);
			var prev_horizontal:VectorLine;
			var prev_vertical:VectorLine;
			var line:VectorLine;
			var point_string:String;
			var register_break_point:Boolean=false;
			var i:int;
			for(i=lines.length-1;i>-1;i--){
				line=lines[i];
				if(prev_horizontal==null || prev_vertical==null){
					if(line.type==VectorLine.HORIZONTAL){
						prev_horizontal=line;
					}else{
						prev_vertical=line;
					}
				}else{break;}
			}
			for(i=i-1;i>-1;i--){
				line=lines[i];
				if(line.type==VectorLine.HORIZONTAL){
					if(line.direction!=prev_horizontal.direction)register_break_point=true;
					prev_horizontal=line;
				}else{
					if(line.direction!=prev_vertical.direction)register_break_point=true;
					prev_vertical=line;
				}
				if(register_break_point){
					point_string=line.end_point.x+"-"+line.end_point.y;
					if(points[point_string]==null)points[point_string]=1;
					register_break_point=false;
				}
			}
		}

	}
}