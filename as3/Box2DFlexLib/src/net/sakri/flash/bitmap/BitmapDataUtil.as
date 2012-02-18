package net.sakri.flash.bitmap{
	
	//import flash.display.BitmapData;
	import flash.display.BitmapData;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class BitmapDataUtil{
		
		//import flash.display.BitmapData;
		
		public static function getPointsMatchingColor(bmd:flash.display.BitmapData,color:uint):Vector.<Point>{
			var points:Vector.<Point>=new Vector.<Point>();
			for(var i:uint=0;i<bmd.height;i++){
				for(var j:uint=0;j<bmd.width;j++){
					if(bmd.getPixel(j,i)==color){
						points.push(new Point(j,i));
					}
				}
			}
			return points;
		}
		
		public static function getPointsMatchingColor32(bmd:flash.display.BitmapData,color:uint):Vector.<Point>{
			var points:Vector.<Point>=new Vector.<Point>();
			for(var i:uint=0;i<bmd.height;i++){
				for(var j:uint=0;j<bmd.width;j++){
					if(bmd.getPixel32(j,i)==color){
						points.push(new Point(j,i));
					}
				}
			}
			return points;
		}

		public static function getNonTransparentPoints(bmd:flash.display.BitmapData,grab_every:uint=2,resize_percent:Number=1,offset:Point=null):Vector.<Point>{
			if(offset==null)offset=new Point(0,0);
			var points:Vector.<Point>=new Vector.<Point>();
			for(var i:uint=0;i<bmd.height;i+=grab_every){
				for(var j:uint=0;j<bmd.width;j+=grab_every){
					if(bmd.getPixel32(j,i)>0x00000000){
						points.push(new Point(j/resize_percent+offset.x,i/resize_percent+offset.y));
					}
				}
			}
			return points;
		}


		/**
		 * Replaces all pixels with a transparency greater than 'alpha_threshold' with color, rest with transparency
		 */
		public static function toMonoChrome(source:flash.display.BitmapData,mono_color:uint=0xFF000000):flash.display.BitmapData{
			var bmd:flash.display.BitmapData=source.clone();
			bmd.threshold(bmd,bmd.rect,new Point(),">",0x00000000,mono_color);
			return bmd;
		}
		
		public static function toMonoChrome2(source:flash.display.BitmapData,mono_color:uint=0xFF000000):flash.display.BitmapData{
			var bmd:flash.display.BitmapData=source.clone();
			bmd.threshold(bmd,bmd.rect,new Point(),"<",0xFF000000,0x00000000);
			return bmd;
		}
		
		public static function containsTransparentPixels(bmd:flash.display.BitmapData):Boolean{
			if(!bmd.transparent)return false;
			var test:flash.display.BitmapData=bmd.clone();
			return  test.threshold(bmd,bmd.rect,new Point(),"<",0x01,0xFF000000) > 0 ? true : false ; 
		}
		
		public static function containsSolidPixels(bmd:flash.display.BitmapData):Boolean{
			var rect:Rectangle=bmd.getColorBoundsRect(0xFF000000,0,false);
			return !rect.equals(new Rectangle());
		}
			
		// FUNCTIONS FOR STRIPPING TRANSPARENT PIXELS FROM SIDES OF BITMAPDATA
		public static function stripTransparentEdges(bm:flash.display.BitmapData):flash.display.BitmapData{
			bm=stripTransparentEdgeFromTop(bm);
			bm=stripTransparentEdgeFromBottom(bm);
			bm=stripTransparentEdgeFromRight(bm);
			return stripTransparentEdgeFromLeft(bm);		
		}
		
		public static function stripTransparentEdgeFromTop(bm:flash.display.BitmapData):flash.display.BitmapData{
			var i:uint,j:uint,first_colored:uint=0;
			outer:for(i=0;i<bm.height;i++){
				for(j=0;j<bm.width;j++){
					if(bm.getPixel32(j,i)!=0x00000000){
						first_colored=i;
						break outer;
					}
				}
			}
			//trace("\nstef_top1, height:"+bm.height+",fc:"+first_colored);
			if(first_colored==0)return bm;
			var stripped:flash.display.BitmapData=new flash.display.BitmapData(bm.width,bm.height-first_colored,true,0x00000000);
			stripped.draw(bm,new Matrix(1,0,0,1,0,-first_colored));
			//trace("stef_top2, height:"+stripped.height);
			return stripped;
		}

		public static function stripTransparentEdgeFromBottom(bm:flash.display.BitmapData):flash.display.BitmapData{
			var i:int,j:uint,first_colored:uint=bm.height;
			//trace("\n**stef_bottom: bm.height:"+bm.height);
			outer:for(i=bm.height;i>-1;i--){
				for(j=0;j<bm.width;j++){
					if(bm.getPixel32(j,i)!=0x00000000){
						first_colored=i+1;
						break outer;
					}
				}
			}
			//trace("stef_botttom1, height:"+bm.height+",fc:"+first_colored);
			if(first_colored==bm.height)return bm;
			var stripped:flash.display.BitmapData=new flash.display.BitmapData(bm.width,first_colored,true,0x00000000);
			stripped.draw(bm);
			//trace("stef_botttom2, height:"+stripped.height);
			return stripped;
		}
		
		//TO BE IMPLEMENTED!!!!		(seems done, not checked or tested)
		public static function stripTransparentEdgeFromLeft(bm:flash.display.BitmapData):flash.display.BitmapData{
			var i:uint,j:uint,first_colored:uint=0;
			outer:for(i=0;i<bm.width;i++){
				for(j=0;j<bm.height;j++){
					if(bm.getPixel32(i,j)!=0x00000000){
						first_colored=i;
						break outer;
					}
				}
			}
			//trace("\nstef_left1, width:"+bm.width+",fc:"+first_colored);
			if(first_colored==0)return bm;
			var stripped:flash.display.BitmapData=new flash.display.BitmapData(bm.width-first_colored,bm.height,true,0x00000000);
			stripped.draw(bm,new Matrix(1,0,0,1,-first_colored,0));
			//trace("stef_left2, width:"+stripped.width);
			return stripped;
		}

		//TO BE IMPLEMENTED!!!!		(seems done, not checked or tested)
		public static function stripTransparentEdgeFromRight(bm:flash.display.BitmapData):flash.display.BitmapData{
			var i:int,j:uint,first_colored:uint=bm.width;
			outer:for(i=bm.width;i>-1;i--){
				for(j=0;j<bm.height;j++){
					if(bm.getPixel32(i,j)!=0x00000000){
						first_colored=i+1;
						break outer;
					}
				}
			}
			//trace("\nstef_right1, width:"+bm.width+",fc:"+first_colored);
			if(first_colored==bm.width)return bm;
			var stripped:flash.display.BitmapData=new flash.display.BitmapData(first_colored,bm.height,true,0x00000000);
			stripped.draw(bm);
			//trace("stef_right2, width:"+stripped.width);
			return stripped;
		}
		
		//hybrid
		public static function getFirstNonTransparentPixel( bmd:BitmapData, start_y:uint=0 ):Point{
			var hit_rect:Rectangle=new Rectangle(0,0,bmd.width,1);
			var p:Point = new Point();
			for( hit_rect.y = start_y; hit_rect.y < bmd.height; hit_rect.y++ ){
				if( bmd.hitTest( p, 0x01, hit_rect) ){
				var hit_bmd:BitmapData=new BitmapData( bmd.width, 1, true, 0 );
				hit_bmd.copyPixels( bmd, hit_rect, p );
				return hit_rect.topLeft.add( hit_bmd.getColorBoundsRect(0xFF000000, 0, false).topLeft );
				}
			}
			return null;
		}
		
		//by Mario Klingeman
		public static function getFirstNonTransparentPixel2( bmd:BitmapData ):Point{
			var r1:Rectangle = bmd.getColorBoundsRect( 0xff000000, 0, false );
			if ( r1.width > 0 ){
				var temp:BitmapData = new BitmapData( r1.width, 1, true, 0 );
				temp.copyPixels( bmd, r1, new Point());
				var r2:Rectangle = temp.getColorBoundsRect( 0xff000000, 0, false );
				return r1.topLeft.add( r2.topLeft );
			}
			return null;
		}
		
		public static function getFirstNonTransparentPixelLooping(bmd:flash.display.BitmapData):Point{
			var ix:uint,iy:uint,bmd_height:uint=bmd.height,bmd_width:uint=bmd.width;
			for (iy=0;iy<bmd_height;iy++){
				for(ix=0;ix<bmd_width;ix++){
					if(bmd.getPixel32(ix,iy)>0x00000000){
						return new Point(ix,iy);
					}
				}
			}
			return null;
		}
		
		public static function getFirstNonTransparentPixelFloodFill(bmd:flash.display.BitmapData,test_fill_color:uint=0xFFFFFF00):Point{
			//var hit_bmd:BitmapData=new BitmapData(bmd.width,1,true,0);
			var hit_bmd:BitmapData;
			var m:Matrix=new Matrix();
			for(var i:int=0;i<bmd.height;i++){
				m.ty=-i;
				hit_bmd=new BitmapData(bmd.width,1,true,0);
				hit_bmd.draw(bmd,m);
				hit_bmd.floodFill(0,0,test_fill_color);//use yellow, assume that the image tested is monochrome... (black and transparent)
				var bounds:Rectangle=hit_bmd.getColorBoundsRect(0xFFFFFFFF,test_fill_color);
				if(bounds.width!=bmd.width){
					return new Point(i,bounds.width);
				}
				//hit_bmd.floodFill(0,0,0);
				hit_bmd.dispose();
			}
			return null;
		}

		public static function getFirstNonTransparentPixelHitTest(bmd:flash.display.BitmapData,test_fill_color:uint=0xFFFFFF00):Point{
			var hit_rect:Rectangle=new Rectangle(0,0,bmd.width,1);
			for(var i:uint=0;i<bmd.height;i++){
				if(bmd.hitTest(new Point(),0x01,hit_rect)){
					var hit_bmd:BitmapData=new BitmapData(bmd.width,1,true,0);
					var m:Matrix=new Matrix(1,0,0,1,0,-i);
					hit_bmd.draw(bmd,m);
					hit_bmd.floodFill(0,0,test_fill_color);//use yellow, assume that the image tested is monochrome... (black and transparent)
					var bounds:Rectangle=hit_bmd.getColorBoundsRect(0xFFFFFFFF,test_fill_color);
					return new Point(bounds.width,i);
				}
				hit_rect.y++;
			}
			return null;
		}
		
		public static function changeEdgePixels(bmd:flash.display.BitmapData,replace:uint):flash.display.BitmapData{
			var ix:uint,iy:uint,bmd_height:uint=bmd.height,bmd_width:uint=bmd.width;
			var max_y:uint=bmd_height-1,max_x:uint=bmd_width-1;
			var update:Vector.<Point>=new Vector.<Point>();
			for (iy=0;iy<bmd_height;iy++){
				for(ix=0;ix<bmd_width;ix++){
					if(bmd.getPixel32(ix,iy)>0x00000000){
						if(!iy || !ix || iy==max_y || ix==max_x){
							update.push(new Point(ix,iy));
						}else if(
								!(	bmd.getPixel32(ix-1,iy)>0x00000000 && 
									bmd.getPixel32(ix+1,iy)>0x00000000 && 
									bmd.getPixel32(ix,iy-1)>0x00000000 &&
									bmd.getPixel32(ix,iy+1)>0x00000000 )
								){
							update.push(new Point(ix,iy));
						}
					}
				}
			}
			var tot:uint=update.length;
			var p:Point;
			for (var i:uint=0;i<tot;i++){
				p=update[i];
				bmd.setPixel32(p.x,p.y,replace);
			}
			return bmd;
		}

	}
}