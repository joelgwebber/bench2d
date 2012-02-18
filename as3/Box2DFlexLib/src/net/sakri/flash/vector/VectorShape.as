package net.sakri.flash.vector{
	import flash.geom.Point;
	
	public class VectorShape{

		protected var _break_points:Vector.<Point>;		
		public function set break_points(bp:Vector.<Point>):void{
			_break_points=bp;
		}
		public function get break_points():Vector.<Point>{
			return _break_points;
		}

		protected var _lines:Vector.<VectorLine>;				
		public function set lines(comps:Vector.<VectorLine>):void{
			_lines=comps;
		}
		public function get lines():Vector.<VectorLine>{
			return _lines;
		}

		protected var _curve_accuracy:uint;
		protected var _min_line_length:uint;

		public function VectorShape(curve_accuracy:uint=10,min_segment_length:uint=5){
			_curve_accuracy=curve_accuracy;
			_min_line_length=min_segment_length;
		}
		
		protected function orderBreakPoints():void{
			var ordered:Vector.<Point>=new Vector.<Point>();
			var i:uint,j:uint;
			var line:VectorLine;
			var point:Point;
			outer:for(i=0;i<_lines.length;i++){
				line=VectorLine(_lines[i]);
				inner:for(j=0;j<_break_points.length;j++){
					if(Point(_break_points[j]).equals(line.start_point)){
						ordered.push(_break_points.splice(j,1)[0]);
						break inner;
					}
				}
			}
			if(_break_points.length){
				throw new Error("VectorShape Error : orderBreakPoints() ordering failed");
				return;				
			}else{
				_break_points=ordered;
			}
		}

		protected function removeShortLines(lines:Vector.<VectorLine>):Vector.<VectorLine>{
			var line:VectorLine;
			var optimized:Vector.<VectorLine>=new Vector.<VectorLine>();
			optimized[0]=lines[0];
			for(var i:int=1;i<lines.length;i++){
				line=VectorLine(lines[i]);
				if(line.length<=_min_line_length){
					if(VectorLine(lines[i-1]).type==VectorLine.DIAGONAL){
						VectorLine(optimized[optimized.length-1]).end_point=line.end_point;
						continue;
					}
					if(i+1<lines.length){
						if(VectorLine(lines[i+1]).type==VectorLine.DIAGONAL){
							line.end_point=VectorLine(lines[i+1]).end_point;
							i++;
						}							
					}
				}
				optimized.push(line);
			}
			return optimized;
		}

		protected function optimizeDiagonalSequences(lines:Vector.<VectorLine>):Vector.<VectorLine>{
			var optimized:Vector.<VectorLine>=new Vector.<VectorLine>();
			var i:uint,j:uint;
			var line:VectorLine;
			var diagonal:VectorLine;
			outer:for(i=0;i<lines.length;i++){
				diagonal=null;
				line=VectorLine(lines[i]);
				inner:for(j=i+1;j<lines.length;j++){
					if(isDiagonalSequence(line,lines[j])){
						diagonal=new VectorLine(line.start_point,VectorLine(lines[j]).end_point,VectorLine.DIAGONAL);
					}else{
						break inner;
					}
				}
				if(diagonal!=null){
					optimized.push(diagonal);
					i=j-1;
				}else{
					optimized.push(lines[i]);
				}
			}
			return optimized;
		}
		
		protected var _diagonal_sequence_buffer:Number=0.03;
		protected function isDiagonalSequence(a:VectorLine,b:VectorLine):Boolean{
			if(a.type!=VectorLine.DIAGONAL || b.type!=VectorLine.DIAGONAL)return false;
			var angle1:Number=Math.atan2(a.end_point.y-a.start_point.y,a.end_point.x-a.start_point.x);
			var angle2:Number=Math.atan2(b.end_point.y-a.start_point.y,b.end_point.x-a.start_point.x);
			var diff:Number=Math.abs(angle1-angle2);
			return diff<_diagonal_sequence_buffer;
		}
		
		public function optimizeUsingBreakPoints():void{
			//failsafe
			if(_break_points==null){
				throw new Error("VectorShape Error : optimizeUsingBreakPoints() null _break_points");
				return;
			}
			orderBreakPoints();
			//removeShortBreakPoints();
			var line:VectorLine;
			var last_bp_index:uint=0;
			var anchor:uint=0;
			var bp_index:uint=1;
			var optimized_lines:Vector.<VectorLine>=new Vector.<VectorLine>();
			var breaks_copy:Vector.<Point>=_break_points.slice();
			breaks_copy.push(_break_points[0]);
			var lines_copy:Vector.<VectorLine>=_lines.slice();
			lines_copy.push(_lines[0]);
			var diagonal:VectorLine;
			for(var i:uint=1;i<lines_copy.length;i++){
				line=lines_copy[i];
				if(line.start_point.equals(breaks_copy[bp_index])){
					if(i-anchor==1){
						optimized_lines.push(lines_copy[i-1]);//no need to set type...
					}else{
						if(isDiagonal(lines_copy,anchor,i)){
							diagonal=mergeLines(VectorLine(lines_copy[anchor]),line);
							diagonal.type=VectorLine.DIAGONAL;
							optimized_lines.push(diagonal);
						}else{
							optimized_lines=optimized_lines.concat(handleComplexSegment(lines_copy,anchor,i));//might throw error!
						}
					}
					anchor=i;
					bp_index++;
					if(bp_index>=breaks_copy.length)break;
				}
			}
			optimized_lines=optimizeDiagonalSequences(optimized_lines);
			
			optimized_lines=removeShortLines(optimized_lines);
			_lines=optimized_lines;
		}

		//should the second be the end point?!
		protected function mergeLines(line1:VectorLine,line2:VectorLine):VectorLine{
			return new VectorLine(line1.start_point,line2.start_point,VectorLine.DIAGONAL,0);
		}

		protected function getMiddlePointInVLineSegment(lines_vect:Vector.<VectorLine>,index1:uint,index2:uint):Point{
			var mid_index:uint=Math.round(index1+(index2-index1)/2);
			return VectorLine(lines_vect[mid_index]).start_point;		
		}
		
		protected var _diagonal_buffer:Number=.15;
		protected function isDiagonal(lines_vect:Vector.<VectorLine>,index1:uint,index2:uint):Boolean{
			var first:Point=VectorLine(lines_vect[index1]).start_point;
			var middle:Point=getMiddlePointInVLineSegment(lines_vect,index1,index2);
			var last:Point=VectorLine(lines_vect[index2]).start_point;
			var diff:Number=Point.distance(first,last)-Point.distance(first,middle)-Point.distance(middle,last);
			return Math.abs(diff)<_diagonal_buffer;
		}
				
		protected function handleComplexSegment(lines:Vector.<VectorLine>,index1:uint,index2:uint):Vector.<VectorLine>{
			var curve_lines:Vector.<VectorLine>=new Vector.<VectorLine>();
			var sub_lines:Vector.<VectorLine>=new Vector.<VectorLine>();
			sub_lines=getLineDiagonalCombo(lines,index1,index2);
			if(sub_lines.length){
				return sub_lines;
			}
			return getVectorLinesInCurve(lines,index1,index2);
		}
		
		protected function getLineDiagonalCombo(lines:Vector.<VectorLine>,index1:uint,index2:uint):Vector.<VectorLine>{
			var found:Vector.<VectorLine>=new Vector.<VectorLine>();
			if(isDiagonal(lines,index1+1,index2) && VectorLine(lines[index1]).length>this._curve_accuracy){
				found[0]=VectorLine(lines[index1]);
				VectorLine(found[0]).type=VectorLine.HORIZONTAL;//or VERTICAL... maybe check...
				found[1]=mergeLines(VectorLine(lines[index1+1]),VectorLine(lines[index2]));
				VectorLine(found[1]).type=VectorLine.DIAGONAL;
			}
			if(isDiagonal(lines,index1,index2-1) && VectorLine(lines[index2-1]).length>this._curve_accuracy){
				found[0]=mergeLines(VectorLine(lines[index1]),VectorLine(lines[index2-1]));
				VectorLine(found[0]).type=VectorLine.DIAGONAL;
				found[1]=VectorLine(lines[index2-1]);
				VectorLine(found[1]).type=VectorLine.HORIZONTAL;//or VERTICAL... maybe check...
			}
			return found;
		}

		protected function getVectorLinesInCurve(lines:Vector.<VectorLine>,index1:uint,index2:uint):Vector.<VectorLine>{
			var found:Vector.<VectorLine>=new Vector.<VectorLine>();
			var anchor:uint=index1;
			var line:VectorLine;
			for(var i:uint=index1+1;i<index2;i++){
				if(Point.distance(VectorLine(lines[anchor]).start_point,VectorLine(lines[i]).start_point)>_curve_accuracy){
					line=new VectorLine(VectorLine(lines[anchor]).start_point,VectorLine(lines[i]).start_point,VectorLine.DIAGONAL);
					found.push(line);
					anchor=i
				}
			}
			if(line==null){
				line=new VectorLine(VectorLine(lines[index1]).start_point,VectorLine(lines[index2]).start_point,VectorLine.DIAGONAL);
				found.push(line);
				return found;
			}
			if(!line.end_point.equals(VectorLine(lines[index2]).start_point)){
				if(Point.distance(line.end_point,VectorLine(lines[index2]).start_point)<_curve_accuracy){
					line.end_point=VectorLine(lines[index2]).start_point;
				}else{
					line=new VectorLine(line.end_point,VectorLine(lines[index2]).start_point,VectorLine.DIAGONAL);
					found.push(line);
				}
			}
			return found;
		}

		public function getPointsVector():Vector.<Point>{
			var p:Vector.<Point>=new Vector.<Point>();
			if(_lines.length){
				for(var i:uint=0;i<_lines.length;i++){
					p[i]=VectorLine(_lines[i]).start_point;
				}
			}
			p[i]=VectorLine(_lines[i-1]).end_point;
			//might still need to add the first as last to close the shape...
			return p;
		}

	}
}